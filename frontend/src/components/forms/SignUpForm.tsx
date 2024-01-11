import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as ReactRouterLink } from "react-router-dom";

type SignupValues = {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  password: string;
  role: string;
};

const SignUpForm = () => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<SignupValues>();

  const mutation = useMutation({
    mutationFn: (values: SignupValues) => {
      return axios.post("/users/signup", values);
    },
    onSuccess: (res) => {
      toast({
        title: "User created.",
        description: `user created with id of ${res.data.user_id}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const onSubmit: SubmitHandler<SignupValues> = (values) => {
    mutation.mutate(values);
    reset();
  };

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      background="linear-gradient(90deg, rgba(0,255,231,1) 32%, rgba(141,0,255,1) 100%)"
    >
      <Box display="flex" flexDirection="column" width="30%">
        <Text padding="10px" fontWeight="700" fontSize="4xl" color="white">
          Signup Form
        </Text>
        <form
          style={{
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "white",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="10px"
          >
            <Box>
              <FormControl mt="10px" isInvalid={!!errors.firstName}>
                <FormLabel htmlFor="firstName">First name</FormLabel>
                <Input
                  id="firstName"
                  placeholder="first name"
                  {...register("firstName", {
                    required: "first name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.firstName && errors.firstName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="10px" isInvalid={!!errors.lastName}>
                <FormLabel htmlFor="lastName">Last name</FormLabel>
                <Input
                  id="lastName"
                  placeholder="last name"
                  {...register("lastName", {
                    required: "last name is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.lastName && errors.lastName.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl mt="10px" isInvalid={!!errors.address}>
                <FormLabel htmlFor="address">address</FormLabel>
                <Input
                  id="address"
                  placeholder="address"
                  {...register("address", {
                    required: "address is required",
                  })}
                />
                <FormErrorMessage>
                  {errors.address && errors.address.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box>
              <FormControl mt="10px" isInvalid={!!errors.email}>
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
              <FormControl mt="10px" isInvalid={!!errors.role}>
                <FormLabel>Role</FormLabel>
                <Select
                  {...register("role", {
                    required: "role is required",
                  })}
                  placeholder="Select Role"
                >
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </Select>
                <FormErrorMessage>
                  {errors.role && errors.role.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </Box>

          <Box display="flex" mt="10px" alignItems="center" gap="10px">
            <Button color="blue" type="submit">
              Submit
            </Button>
            <Link as={ReactRouterLink} to="/login">
              Login
            </Link>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default SignUpForm;
