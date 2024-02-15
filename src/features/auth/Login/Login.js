import { Field, Formik } from "formik";
import React, { useEffect } from "react";
import {
  Form as RouteForm,
  redirect,
  useActionData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import * as yup from "yup";
import sass from "../form.module.scss";
import { Alert, Button, Form } from "react-bootstrap";
import InputBox from "../../../components/InputBox/InputBox";
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
        authApiSlice.endpoints.login.initiate(data, { track: false })
      ).unwrap();
      return { data: res };
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

const Login = () => {
  const schema = yup.object({
    email: yup
      .string()
      .email("please write valid email")
      .required("the email is required field"),
    password: yup.string().required("the password is required field"),
  });

  const [searchParams] = useSearchParams();

  const { error, data } = useActionData() || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      dispatch(setCredintials(data));
      navigate(searchParams.get("from") || "/");
    }
  }, [data, dispatch, navigate, searchParams]);

  return (
    <section>
      <div className="container">
        <Formik
          initialValues={{ email: "", password: "" }}
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
              <h2 className="page-head mb-5">log in</h2>
              <div className="d-flex flex-column gap-3 px-4 justify-content-center">
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
                <Button
                  className="d-block mt-4 px-5 mx-auto text-capitalize"
                  type="submit"
                  disabled={!isValid}
                >
                  log in
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default Login;
