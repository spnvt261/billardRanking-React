import CustomButton from "../../../customButtons/CustomButton";
import CustomKeyField from "../../../customKeyField/CustomKeyField";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../../customTextField/CustomTextField";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import workspaceAction from "../../../../redux/features/workspace/workspaceAction";
import { useWorkspace } from "../../../../customhook/useWorkspace";
import { useNotification } from "../../../../customhook/useNotifycation";
import { LOCAL_STORAGE_ACCESS_TOKEN } from "../../../../constants/localStorage";
import { useLocalStorage } from "../../../../customhook/useLocalStorage";
import type { CheckWorkspaceResponse, LoginWorkspaceResponse } from "../../../../types/workspace";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading: boolean;
    keyValue?: string;
    joinWorkspace: (data: { shareKey: Number }) => Promise<CheckWorkspaceResponse>;
    loginWorkspace: (data: { workspaceKey: Number, password: string }) => Promise<LoginWorkspaceResponse>;
}
const FormJoinWorkSpace = ({ btnCancel, showLoading, isLoading, joinWorkspace, loginWorkspace,keyValue }: Props) => {
    const { addWorkspace, hasWorkspace, setWorkspaceKey,setWorkspaceId } = useWorkspace();
    
    const [, setAccessToken] = useLocalStorage<string | null>(LOCAL_STORAGE_ACCESS_TOKEN, '');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { notify } = useNotification();

    const lastSubmitTime = useRef<number | null>(null);

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
            key: keyValue?keyValue:'',
            isAdmin: keyValue?true:false,
            password: "",
        },
        validationSchema: Yup.object({
            key: Yup.string()
                .required("Vui lòng nhập KEY")
                .matches(/^\d{8}$/, "KEY phải gồm 8 chữ số"),
            password: Yup.string().when("isAdmin", {
                is: true,
                then: (schema) =>
                    schema
                        .required("Vui lòng nhập mật khẩu"),
                otherwise: (schema) => schema.notRequired(),
            }),
        }),
        onSubmit: async (values) => {
            if (hasWorkspace(values.key) && !keyValue) {
                setErrorMessage(`Nhóm có KEY '${values.key}' đã được thêm rồi!`);
                return;
            }
            // console.log(values);
            
            if (!values.isAdmin) {
                const parsedValues = {
                    shareKey: Number(values.key),
                };
                try {
                    const result = await joinWorkspace(parsedValues);
                    if (!result.exists) {
                        setErrorMessage("Nhóm này không tồn tại!");
                        return;
                    } else {
                        if (result.workspace) {
                            addWorkspace(result.workspace);
                            btnCancel();
                            notify('Đã vào nhóm', 'success');
                        }
                    }
                } catch (err: any) {
                    console.log(err.code);
                    notify('Lỗi kết nối server', 'error');
                }
            } else {
                const data = {
                    workspaceKey: Number(values.key),
                    password: values.password
                };
                try {
                    const result = await loginWorkspace(data);
                    if (result.workspace) {
                        const resultParsed = {
                            ...result.workspace,
                            isAdmin: true
                        }
                        setAccessToken(result.accessToken);
                        if(!keyValue) addWorkspace(resultParsed);
                        setWorkspaceId(result.workspace.id.toString());
                        setWorkspaceKey(values.key);
                        btnCancel();
                        notify('Đăng nhập thành công', 'success');
                    }
                } catch (err: any) {
                    // console.log(err.status);
                    if (err.status === 400) {
                        setErrorMessage("Key hoặc mật khẩu không đúng!");
                        return;
                    }
                    notify('Lỗi kết nối server', 'error');
                }
            }
        },
    });
    return (
        <form className="flex flex-col"
            onSubmit={handleSubmit}
        >
            <div className="w-full flex justify-center">
                <CustomKeyField
                    name="key"
                    value={formik.values.key}
                    onChange={(e) => { formik.handleChange(e); setErrorMessage(null); }}
                    error={formik.touched.key ? formik.errors.key : undefined}
                    errorText={errorMessage}
                    disabled={keyValue?true:false}
                />
            </div>

            <label className="mt-4 flex items-center space-x-2 cursor-pointer w-fit">
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formik.values.isAdmin}
                    onChange={formik.handleChange}
                    className="w-4 h-4 cursor-pointer"
                    disabled={keyValue?true:false}
                />
                <span>Admin?</span>
            </label>

            {formik.values.isAdmin && (
                <CustomTextField
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && !!formik.errors.password}
                    helperText={formik.touched.password ? formik.errors.password : ""}
                    className="mt-4"
                />
            )}

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
    )
}
const mapStateToProps = (state: any) => {
    return {
        isLoading: state.workspace.isLoading
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        joinWorkspace: (data: { shareKey: Number }) => dispatch(workspaceAction.joinWorkspace(data)),
        loginWorkspace: (data: { workspaceKey: Number, password: string }) => dispatch(workspaceAction.loginWorkspace(data))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(FormJoinWorkSpace);