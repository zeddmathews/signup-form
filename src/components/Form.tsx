import { useState } from "react";
import TextField from "./TextField";

type FormState = {
  username: string;
  usernameError: string;
  email: string;
  emailError: string;
  password: string;
  passwordError: string;
  verifyPassword: string;
  verifyError: string;
  postError: string;
};

const formInitialState: FormState = {
  username: "",
  usernameError: "",
  email: "",
  emailError: "",
  password: "",
  passwordError: "",
  verifyPassword: "",
  verifyError: "",
  postError: "",
};

type FormFields = keyof typeof formInitialState;

type FormInputProps = {
  label: string;
  value: string;
  field: FormFields;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function FormInput({
  field,
  label,
  value,
  error,
  ...textFieldProps
}: FormInputProps) {
  return (
    <div className="form-group mb-4">
      <label
        htmlFor={field}
        className="block text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}:
      </label>
      <TextField
        type="text"
        value={value}
        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        {...textFieldProps}
      />
      {error ? (
        <div className="error text-red-600 dark:text-red-400 mt-1">{error}</div>
      ) : null}
    </div>
  );
}

export default function Form() {
  const [formState, setFormState] = useState<FormState>(formInitialState);
  const {
    email,
    emailError,
    password,
    passwordError,
    postError,
    username,
    usernameError,
    verifyError,
    verifyPassword,
  } = formState;
  type Response = {
    message: string;
  };
  const [responseData, setResponseData] = useState<Response>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(email);
    try {
      const res = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
      const data: Response = await res.json();
      setResponseData(data);

      if (!res.ok) {
        setFormState((prev) => ({
          ...prev,
          postError: data.message ? data.message : "some shit broke",
        }));
        throw new Error(data.message || "some shit broke");
      }
    } catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  const validateUsername = () => {
    const usernameRegex = /^[a-zA-Z0-9]*$/;
    if (username.length < 4)
      setFormState((prev) => ({
        ...prev,
        usernameError: "Username too short",
      }));
    else if (!usernameRegex.test(username))
      setFormState((prev) => ({
        ...prev,
        usernameError: "No special characters allowed",
      }));
    else setFormState((prev) => ({ ...prev, usernameError: "" }));
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormState((prev) => ({
        ...prev,
        emailError: "Invalid email address",
      }));
    } else {
      setFormState((prev) => ({ ...prev, emailError: "" }));
    }
  };

  const validatePassword = () => {
    let error = "";
    const specialCharsRegex = /[!-/:-@[-`{-~]/;
    if (password.length < 8) {
      error = "Password must be at least 8 characters long";
    } else if (password.length > 20) {
      error = "Password must be no more than 20 characters long";
    } else if (!/[a-z]/.test(password)) {
      error = "Password must include at least one lowercase letter";
    } else if (!/[A-Z]/.test(password)) {
      error = "Password must include at least one uppercase letter";
    } else if (!/\d/.test(password)) {
      error = "Password must include at least one number";
    } else if (!specialCharsRegex.test(password)) {
      error = "Password must include at least one special character";
    } else {
      error = "";
    }
    setFormState((prev) => ({ ...prev, passwordError: error }));
  };

  const validateVerifyPassword = () => {
    if (password !== verifyPassword)
      setFormState((prev) => ({
        ...prev,
        verifyError: "Passwords do not match",
      }));
    else setFormState((prev) => ({ ...prev, verifyError: "" }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    switch (event.target.type) {
      case "email":
        validateEmail();
        break;
      case "text":
        validateUsername();
        break;
      case "password":
        validatePassword();
        validateVerifyPassword();
        break;
      default:
        break;
    }
  };

  function onChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: FormFields
  ) {
    setFormState((previousState) => ({
      ...previousState,
      [field]: event.target.value,
    }));
  }

  function onReset() {
    setResponseData(undefined);
    setFormState(formInitialState);
  }
  if (responseData) {
    return (
      <div className="flex flex-col gap-2">
        <div className="text-center flex flex-col p-4 justify-center items-center">
          <div className="w-96 p-5 rounded border-2 border-green-700 text-green-600">
            {responseData.message}
          </div>
        </div>
        <div className="text-center">
          <button className="border-2 border-black rounded p-2 px-4 hover:bg-slate-300" onClick={onReset}>Reset</button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <FormInput
          onBlur={handleBlur}
          field="username"
          label="Username"
          value={username}
          error={usernameError}
          onChange={(e) => onChange(e, "username")}
        />
        <FormInput
          onBlur={handleBlur}
          field="email"
          type="email"
          label="Email"
          value={email}
          error={emailError}
          onChange={(e) => onChange(e, "email")}
        />
        <FormInput
          onBlur={handleBlur}
          field="password"
          type="password"
          label="Password"
          value={password}
          error={passwordError}
          onChange={(e) => onChange(e, "password")}
        />
        <FormInput
          onBlur={handleBlur}
          field="verifyPassword"
          type="password"
          label="Verify Password"
          value={verifyPassword}
          error={verifyError}
          onChange={(e) => onChange(e, "verifyPassword")}
        />

        {postError ? (
          <div className="text-red-500 border-2 border-red-600 text-center hover:bg-red-300 p-2 rounded-lg font-semibold text-lg">
            {postError}
          </div>
        ) : null}
        <button
          type="submit"
          className="w-full bg-blue-500 dark:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
