import React, { useContext, useState } from "react";
import { Header, CloseButton, Input } from "../Modal";
import { IoCloseSharp } from "react-icons/io5";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";
const NewFolder = () => {
  const { closeModal } = useContext(ModalContext);
  const { addFolder } = useContext(PlaygroundContext);
  const [folderTitle, setFolderTitle] = useState("");

  return (
    <div
      style={{
        backgroundColor: "transparent",
        border: "1px solid #7C78EB",
        padding: "16px",
        borderRadius: "8px",
      }}
    >
      <Header>
        <h2>Create New Folder</h2>
        <CloseButton onClick={() => closeModal()}>
          <IoCloseSharp />
        </CloseButton>
      </Header>
      <Input>
        <input
          type="text"
          onChange={(e) => setFolderTitle(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            marginBottom: "8px",
          }}
        />
        <button
          onClick={() => {
            addFolder(folderTitle);
            closeModal();
          }}
          style={{
            backgroundColor: "#7C78EB",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Create Folder
        </button>
      </Input>
    </div>
  );
};

export default NewFolder;
