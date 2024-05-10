import { createContext , useState} from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
 
    const [input,setInput] = useState("")
    const [recentPrompt,setRecentPrompt] = useState("")
    const [previousPrompts,setPreviousPrompts] = useState([])
    const [showResult,setShowresult] = useState(false);
    const [loading,setLoading] = useState(false)
    const [resultData,setResultData] = useState("");


    const newChat = ()=>{
        setLoading(false);
        setShowresult(false);
    }

    const onSent = async (prompt)=>{
        setResultData("");
        setLoading(true);
        setShowresult(true);
        let response;
        // prompt is not undefined means user click on recent tab in side bar
        if(prompt !== undefined){
            console.log("prompt",prompt);
            response = await runChat(prompt);
            setRecentPrompt(prompt)
        }else{
            // type by user
            console.log("input",input);
            setPreviousPrompts(prev => [...prev, input])
            setRecentPrompt(input)
            response = await runChat(input)
        }
        

        //for heading make it bold ** means heading
        let responseArray = response.split("**")
        let newResponse = "" ; 

        for(let i=0;i<responseArray.length;i++){
            if(i==0 || i%2==0){
                newResponse += responseArray[i];
            }else{
                newResponse +=  "<b>" + responseArray[i] + "</b>";
            }
        }
        //single * means new line
        let newResponse2 = newResponse.split("*").join("</br>")
        setResultData(newResponse2);
        setLoading(false);
        setInput("");

    }

   

    const contextValue = {
        previousPrompts,
        setPreviousPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider