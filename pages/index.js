import { useState, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Button from "../components/utils/Button";
import Input from "../components/utils/Input";
import { GameContext } from "../context/GameContext";

export default function Index(){
  const Router = useRouter();
  const { addPlayerName } = useContext(GameContext); 
  const [ nickName, setNickName ] = useState('');

  const handleInputChange = (e) => {
    setNickName(e.target.value);
    addPlayerName(e.target.value);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('nickname', nickName);
    Router.push('/home');
  }
  return(
    <Layout>
      <div className="bg-theme fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
             h-48 w-64 mx-auto flex flex-col items-center justify-center rounded shadow">
        <div className="m-2">
          <h1 className="font-semibold">Welcome to Movie Battle</h1>
        </div>

        <form
          className="flex flex-col items-center" 
          onSubmit={handleSubmit}
        >
         
          <Input 
            name="nickname"
            label="Enter Your Name"
            required={true} 
            value={nickName} 
            handleChange={handleInputChange}
          />
          <Button name="let's start" type="submit" />
        </form>
      </div>
    </Layout>
  )
}