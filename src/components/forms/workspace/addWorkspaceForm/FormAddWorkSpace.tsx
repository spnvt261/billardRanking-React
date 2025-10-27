import { useFormik } from "formik";
import * as Yup from "yup";
import CustomButton from "../../../customButtons/CustomButton";
import CustomTextField from "../../../customTextField/CustomTextField";
import CustomKeyField from "../../../customKeyField/CustomKeyField";
import { FaRandom } from "react-icons/fa";
import CustomNote from "../../../customNote/CustomNote";
import { useEffect, useRef, useState } from "react";
import workspaceAction from "../../../../redux/features/workspace/workspaceAction";
import { connect } from "react-redux";
import { useWorkspace } from "../../../../customhook/useWorkspace";
import { useNotification } from "../../../../customhook/useNotifycation";
import { useLocalStorage } from "../../../../customhook/useLocalStorage";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../../constants/localStorage";
import type { CheckWorkspaceResponse, CreateWorkspaceResponse, LoginWorkspaceResponse, WorkspaceData, WorkspaceDataToCreate } from "../../../../types/workspace";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading: boolean;
    createWorkspace: (workspaceData: WorkspaceDataToCreate) => Promise<CreateWorkspaceResponse>;
    joinWorkspace: (data: { shareKey: Number }) => Promise<CheckWorkspaceResponse>;
    loginWorkspace: (data: { workspaceKey: Number, password: string }) => Promise<LoginWorkspaceResponse>;
}
const FormAddWorkSpace = ({ btnCancel, showLoading, isLoading, createWorkspace, joinWorkspace, loginWorkspace }: Props) => {
    // console.log(isLoading);
    const { addWorkspace, setWorkspaceKey,setWorkspaceId } = useWorkspace();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { notify } = useNotification();
    const lastSubmitTime = useRef<number | null>(null);
    const [, setAccessToken] = useLocalStorage<string | null>(LOCAL_STORAGE_ACCESS_TOKEN, '');
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const now = Date.now();
        if (lastSubmitTime.current && now - lastSubmitTime.current < 3000) {
            console.warn("Please wait before submitting again");
            // notify("Vui lòng chờ 3 giây trước khi gửi lại!", "error");
            return;
        }

        lastSubmitTime.current = now;
        formik.handleSubmit(e);
    };
    useEffect(() => {
        if (showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])
    const formik = useFormik({
        initialValues: {
            name: "",
            password: "",
            confirmPassword: "",
            shareKey: "",
        },
        validationSchema: Yup.object({
            shareKey: Yup.string()
                .required("Vui lòng nhập KEY")
                .matches(/^\d{8}$/, "KEY phải gồm 8 chữ số"),
            name: Yup.string()
                .required("Vui lòng nhập tên nhóm")
                .min(3, "Tối thiểu 3 ký tự")
                .max(35, "Tối đa 40 ký tự"),

            password: Yup.string()
                .required("Vui lòng nhập mật khẩu")
                .min(3, "Tối thiểu 3 ký tự")
                .max(50, "Tối đa 50 ký tự"),

            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
                .required("Vui lòng xác nhận mật khẩu"),
        }),

        onSubmit: async (values) => {
            const { confirmPassword, ...rest } = values; // loại bỏ confirmPassword
            const parsedValues = {
                ...rest,
                shareKey: Number(values.shareKey),
            };
            try {
                const result = await createWorkspace(parsedValues);
                if (result.success) {
                    notify('Tạo nhóm thành công', 'success');
                    if (result.workspaceId) {
                        const resultParsed:WorkspaceData = {
                            id: result.workspaceId,
                            name: parsedValues.name,
                            shareKey: parsedValues.shareKey,
                            isAdmin: true,
                            showKey:false,
                        }
                        addWorkspace(resultParsed);
                        btnCancel();
                        notify('Đang đăng nhâp', 'loading');
                        const resultLogin = await loginWorkspace({ workspaceKey: parsedValues.shareKey, password: parsedValues.password });
                        if (resultLogin.workspace) {
                            setAccessToken(resultLogin.accessToken);
                            setWorkspaceKey(resultLogin.workspace.shareKey.toString());
                            setWorkspaceId(resultLogin.workspace.id.toString());
                            notify('Dăng nhập thành công', 'success');
                        }
                    }
                } else {
                    setErrorMessage(`KEY đã tồn tại!`);
                }
            } catch (err: any) {
                console.log(err.message);
                notify('Lỗi kết nối server', 'error');
            }

        },
    });

    const handleRandomKey = async () => {
        let isUnique = false;
        let randomKey = "";

        const maxAttempts = 10;
        let attempt = 0;

        while (!isUnique && attempt < maxAttempts) {
            attempt++;
            randomKey = Math.floor(10000000 + Math.random() * 90000000).toString();

            try {
                const result = await joinWorkspace({ shareKey: Number(randomKey) });
                if (!result.exists) {
                    isUnique = true;
                }
            } catch (err) {
                console.error("Error checking key:", err);
                break;
            }
        }

        if (isUnique) {
            formik.setFieldValue("shareKey", randomKey);
        } else {
            setErrorMessage("Không tạo được KEY ngẫu nhiên. Vui lòng thử lại.");
        }
    };


    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex items-center relative h-fit">
                <div className="flex items-center">
                    <p>
                        <span>KEY</span>
                    </p>
                    <CustomNote noteContent="Dùng để đăng nhập hoặc chia sẻ cho người khác vào nhóm"
                        className="mr-2"
                    />
                </div>

                <CustomKeyField
                    name="shareKey"
                    value={formik.values.shareKey}
                    onChange={(e) => { formik.handleChange(e); setErrorMessage(null); }}
                    // onBlur={formik.handleBlur}
                    error={formik.touched.shareKey ? formik.errors.shareKey : undefined}
                    errorText={errorMessage}
                />
                <button
                    type="button"
                    onClick={handleRandomKey}
                    className="ml-3 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    title="Tạo KEY ngẫu nhiên"
                >
                    <FaRandom className="text-gray-600" />
                </button>
            </div>

            <CustomTextField
                label="Tên nhóm *"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name ? formik.errors.name : ""}
                className="mt-4"
            />

            <CustomTextField
                label="Mật khẩu*"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password ? formik.errors.password : ""}
            />

            <CustomTextField
                label="Xác nhận mật khẩu*"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                helperText={formik.touched.confirmPassword ? formik.errors.confirmPassword : ""}
            />

            <div className="flex justify-end mt-2">
                <CustomButton
                    label="Hủy"
                    variant="type-4"
                    className="mr-2 mb-0"
                    onClick={btnCancel}
                    type="button"
                />
                <CustomButton
                    label="Xác nhận"
                    variant="type-2"
                    type="submit"
                    className="mb-0"
                />
            </div>
        </form>
    );
};

const mapStateToProps = (state: any) => {
    return {
        isLoading: state.workspace.isLoading,
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        createWorkspace: (workspaceData: WorkspaceDataToCreate) => dispatch(workspaceAction.createWorkspace(workspaceData)),
        joinWorkspace: (data: { shareKey: Number }) => dispatch(workspaceAction.joinWorkspace(data)),
        loginWorkspace: (data: { workspaceKey: Number, password: string }) => dispatch(workspaceAction.loginWorkspace(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormAddWorkSpace);
