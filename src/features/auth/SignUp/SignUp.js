import React, { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import InputBox from "../../../components/InputBox/InputBox";
import sass from "../form.module.scss";
import { Field, Formik } from "formik";
import * as yup from "yup";
import {
  Form as RouteForm,
  useActionData,
  useNavigate,
} from "react-router-dom";
import { authApiSlice } from "../authApiSlice";
import { setCredintials } from "../authSlice";
import { useDispatch } from "react-redux";

export const action =
  (dispatch) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      const res = await dispatch(
        authApiSlice.endpoints.register.initiate(data, { track: false })
      ).unwrap();
      return { data: res };
    } catch (err) {
      return { error: "email is already exist" };
    }
  };

const SignUp = () => {
  const schema = yup.object({
    name: yup
      .string()
      .min(3)
      .matches(
        /^[a-zA-Z\s]*$/,
        "the name must be less than 3 and only has letters or spaces"
      )
      .required("the name is required field"),
    email: yup
      .string()
      .email("please write valid email")
      .required("the email is required field"),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%/]).{8,24}$/,
        "password should contain capital and small letters , numbers ,@#$%^&+/= and should be between 8 to 20 character"
      )
      .required("the password is required field"),
    passConf: yup
      .string()
      .oneOf([yup.ref("password"), "passwords must matches"])
      .required("the password is required field"),
  });

  const { error, data } = useActionData() || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setCredintials(data));
      navigate("/", { replace: true });
    }
  }, [data, dispatch, navigate]);

  return (
    <div>
      <div className="container">
        <Formik
          initialValues={{ name: "", email: "", password: "", passConf: "" }}
          validationSchema={schema}
        >
          {({ errors, touched, validateForm, isValid }) => (
            <Form
              as={RouteForm}
              className={"p-3 pb-5 rounded " + sass.form}
              method="post"
              onSubmit={(e) => !isValid && e.preventDefault()}
            >
              {error && (
                <Alert variant="danger" className="mb-4 text-capitalize">
                  {error}
                </Alert>
              )}
              <h2 className="page-head mb-5">sign up</h2>
              <div className="d-flex flex-column gap-3 px-4 justify-content-center">
                <InputBox
                  as={Field}
                  className={"align-items-start"}
                  label={"name :"}
                  controlId={"name"}
                  autoomplete="off"
                  name="name"
                  validate={true}
                  isInvalid={Boolean(errors.name) && touched.name}
                  error={errors.name}
                />
                <InputBox
                  as={Field}
                  className={"align-items-start"}
                  label={"email :"}
                  controlId={"email"}
                  name="email"
                  autoComplete="off"
                  validate={true}
                  isInvalid={Boolean(errors.email) && touched.email}
                  error={errors.email}
                />
                <InputBox
                  as={Field}
                  className={"align-items-start"}
                  type="password"
                  label={"password :"}
                  name="password"
                  controlId={"password"}
                  isInvalid={Boolean(errors.password) && touched.password}
                  validate={true}
                  error={errors.password}
                />
                <InputBox
                  as={Field}
                  className={"align-items-start"}
                  type="password"
                  label={"password confirm :"}
                  name="passConf"
                  controlId={"passConfirm"}
                  isInvalid={Boolean(errors.passConf) && touched.passConf}
                  error={errors.passConf}
                  validate={true}
                />
                <Button
                  className="d-block mt-4 px-5 mx-auto text-capitalize"
                  type="submit"
                  disabled={!isValid}
                >
                  sign up
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
