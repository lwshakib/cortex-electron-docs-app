import React from "react";
import { DocumentContext } from "../context/document-provider";

export const useDocumentContext = () => {
    const context = React.useContext(DocumentContext);
    if (!context) {
        throw new Error("useDocumentContext must be used within a DocumentProvider");
    }
    return context;
}