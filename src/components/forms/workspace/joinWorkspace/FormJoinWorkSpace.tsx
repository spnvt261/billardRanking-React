import CustomButton from "../../../customButtons/CustomButton";
import CustomKeyField from "../../../customKeyField/CustomKeyField";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomTextField from "../../../customTextField/CustomTextField";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import workspaceAction, { type CheckWorkspaceResponse, type LoginWorkspaceResponse } from "../../../../redux/features/workspace/workspaceAction";
import { useWorkspace } from "../../../../customhook/useWorkspace";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading: boolean;
    joinWorkspace: (data: { shareKey: Number }) => Promise<CheckWorkspaceResponse>;
    loginWorkspace:(data:{shareKey:Number,password:string})=>Promise<LoginWorkspaceResponse>;
}
const FormJoinWorkSpace = ({ btnCancel, showLoading, isLoading, joinWorkspace,loginWorkspace }: Props) => {
    const { addWorkspace, hasWorkspace } = useWorkspace();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // console.log(isLoading);
    
    useEffect(() => {
        if (showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])
    const formik = useFormik({
        initialValues: {
            key: "",
            isAdmin: false,
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
            if (!values.isAdmin) {
                const parsedValues = {
                    shareKey: Number(values.key),
                };
                const result = await joinWorkspace(parsedValues);
                if (!result.exists) {
                    setErrorMessage("Workspace không tồn tại!");
                    return;
                } else {
                    if (result.workspace && !hasWorkspace(result.workspace.shareKey.toString())) {
                        addWorkspace(result.workspace);
                        btnCancel();
                    } else {
                        setErrorMessage(`Workspace '${result.workspace?.name}'  đã được thêm rồi!`);
                    }
                }
            } else {
                const parsedValues = {
                    shareKey: Number(values.key),
                    password:values.password
                };
                const result = await loginWorkspace(parsedValues);
                if(result.success){
                    if (result.workspace && !hasWorkspace(result.workspace.shareKey.toString())) {
                        const resultParsed={
                            ...result.workspace,
                            isAdmin:true
                        }
                        addWorkspace(resultParsed);
                        btnCancel();
                    } else {
                        setErrorMessage(`Workspace '${result.workspace?.name}'  đã được thêm rồi!`);
                    }
                }else{
                    setErrorMessage(`${result.message}`);
                    return;
                }
            }
        },
    });
    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="w-full flex justify-center">
                <CustomKeyField
                    name="key"
                    value={formik.values.key}
                    onChange={(e) => { formik.handleChange(e); setErrorMessage(null); }}
                    // onChange={formik.handleChange}
                    // onBlur={formik.handleBlur}
                    error={formik.touched.key ? formik.errors.key : undefined}
                    errorText={errorMessage}
                />
            </div>

            <label className="mt-4 flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    name="isAdmin"
                    checked={formik.values.isAdmin}
                    onChange={formik.handleChange}
                    className="w-4 h-4"
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
        loginWorkspace:(data:{shareKey:Number,password:string}) => dispatch(workspaceAction.loginWorkspace(data))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(FormJoinWorkSpace);