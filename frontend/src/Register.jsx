import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (email === "") return false;
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    if (password === "") return false;
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      const data = await axios.post("http://localhost:8080/api/v1/adduser/", {
        userEmail: email,
        userName: name,
        userPassword: password,
      });
      if (data?.status === 200) {
        alert("Registration successful");
        navigate("/");
        return;
      }
      alert("Registration failed");
    } else {
      setEmailError("Please enter a valid email address");
      setPasswordError(
        "Password must be at least 8 characters long and contain special characters and numbers"
      );
    }
  };

  return (
    <Box
      w={"screen"}
      h={"screen"}
      display={"flex"}
      gap={2}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <form onSubmit={handleSubmit}>
        <Box
          mt={"20vh"}
          w={"lg"}
          p={10}
          background={"gray.700"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          borderRadius={8}
          boxShadow={"lg"}
        >
          <FormControl isInvalid={emailError}>
            <FormLabel>Name</FormLabel>
            <Input
              type="name"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              isRequired
            />
          </FormControl>

          <FormControl isInvalid={emailError}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              isRequired
            />
            <FormErrorMessage>{emailError}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              isRequired
            />
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          </FormControl>

          <Button w={"full"} mt={"2"} type="submit">
            Register
          </Button>
          <Link to="/">Login</Link>
        </Box>
      </form>
    </Box>
  );
}

export default Register;
