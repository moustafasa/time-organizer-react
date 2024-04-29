import { Field, Formik } from "formik";
import React from "react";
import {
  Form as RouteForm,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import * as yup from "yup";
import sass from "../form.module.scss";
import { Alert, Button, Container, Form } from "react-bootstrap";
import InputBox from "../../../components/InputBox/InputBox";
import { authApiSlice } from "../authApiSlice";

export const action =
  (dispatch) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const searchParams = new URLSearchParams(window.location.search);
    try {
      await dispatch(
        authApiSlice.endpoints.login.initiate(data, { track: false })
      ).unwrap();

      return redirect(searchParams.get("from") || "/");
    } catch (error) {
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

  const { error } = useActionData() || {};

  const navigation = useNavigation();

  return navigation.formData ? (
    <div>loading...</div>
  ) : (
    <div>
      <Container>
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
              replace
            >
              {error && (
                <Alert variant="danger" className="mb-4 text-capitalize">
                  {error.data}
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
      </Container>
    </div>
  );
};

export default Login;
