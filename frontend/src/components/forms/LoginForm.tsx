import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Navigate,
  Link as ReactRouterLink,
  useNavigate,
} from "react-router-dom";

type LoginValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginValues>();

  const mutation = useMutation({
    mutationFn: (values: LoginValues) => {
      return axios.post("/users/login", values);
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);
      navigate("/");
      toast({
        title: "Welcome!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error!",
        description: `${error.response.data}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<LoginValues> = (values) => {
    mutation.mutate(values);
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      background="linear-gradient(90deg, rgba(0,255,231,1) 32%, rgba(141,0,255,1) 100%)"
    >
      <Box display="flex" flexDirection="column" width="25%">
        <Text padding="10px" fontWeight="700" fontSize="4xl" color="white">
          Login Form
        </Text>
        <form
          style={{
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "white",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">email</FormLabel>
            <Input
              id="email"
              placeholder="email"
              {...register("email", {
                required: "email is required",
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl mt="10px" isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">password</FormLabel>
            <Input
              type="password"
              id="password"
              placeholder="password"
              {...register("password", {
                required: "password is required",
              })}
            />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>
          <Box display="flex" mt="10px" alignItems="center" gap="10px">
            <Button color="blue" type="submit">
              Submit
            </Button>
            <Link as={ReactRouterLink} to="/signup">
              Sign up
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
