import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Box,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";

import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [_, saveEmail] = useLocalStorage("userEmail", null);
  const [userName, setUserName] = useState("");
  const [, saveUser] = useLocalStorage("userName", null);
  
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
      // perform login action
      const data = await axios
        .post("http://localhost:8080/api/v1/login/", {
          userEmail: email,
          userPass: password,
        })
        .catch((err) => {
          console.log(err);
          alert("Login failed");
        });
      if (data?.status === 200) {
        debugger;
        const  userNameData  = data.data.userName;
        setUserName(userNameData);

          // Store userName in local storage
          saveUser(userNameData);

        alert("Login successful" + userNameData);
        
        saveEmail(email);
        navigate("/1");
        return;
      }
      alert("Login failed");
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
          textAlign="center"
        >
           <Text fontSize="3xl" fontWeight="bold" color="white" mb={2}>
          Kanban Board
        </Text>
        <Text fontSize="md" color="gray.300">
          Your task management tool
        </Text>
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
            Login
          </Button>
          <Link to="/register">
            <Text w={"full"} mt={"2"} color="white">
              Register
            </Text>
          </Link>
        </Box>
      </form>
    </Box>
  );
}

export default Login;
