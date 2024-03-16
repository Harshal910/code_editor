// import React, { useState, useEffect } from "react";
// import {
//   Editor,
//   EditorState,
//   RichUtils,
//   getDefaultKeyBinding,
//   Modifier,
//   ContentState,
// } from "draft-js";
// import "draft-js/dist/Draft.css";
// // import "./styles.css"; // Import your CSS file with styles
// const customStyleMap = {
//   RED_TEXT: {
//     color: "red",
//   },
// };
// const TextEditor = () => {
//   const [editorState, setEditorState] = useState(EditorState.createEmpty());

//   useEffect(() => {
//     const storedEditorState = localStorage.getItem("editorState");
//     if (storedEditorState) {
//       try {
//         const parsedState = JSON.parse(storedEditorState);
//         if (typeof parsedState === "string") {
//           setEditorState(
//             EditorState.createWithContent(
//               ContentState.createFromText(parsedState)
//             )
//           );
//         } else {
//           console.error("Stored editor state is not a string:", parsedState);
//         }
//       } catch (error) {
//         console.error("Error parsing stored editor state:", error);
//       }
//     }
//   }, []);

//   const saveEditorState = () => {
//     localStorage.setItem(
//       "editorState",
//       JSON.stringify(editorState.getCurrentContent().getPlainText())
//     );
//   };

//   const handleKeyCommand = (command, editorState) => {
//     const newState = RichUtils.handleKeyCommand(editorState, command);
//     if (newState) {
//       setEditorState(newState);
//       return "handled";
//     }
//     return "not-handled";
//   };

//   const mapKeyToEditorCommand = (e) => {
//     if (e.keyCode === 9 /* TAB */) {
//       const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
//       if (newEditorState !== editorState) {
//         setEditorState(newEditorState);
//       }
//       return;
//     }
//     return getDefaultKeyBinding(e);
//   };

//   const handleInputChange = (newEditorState) => {
//     setEditorState(newEditorState);
//   };

//   const handleBeforeInput = (chars, editorState) => {
//     const selection = editorState.getSelection();
//     const currentContent = editorState.getCurrentContent();
//     const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
//     const blockText = currentBlock.getText();

//     // Convert to Heading 1 format when '#' followed by space
//     if (
//       chars === " " &&
//       blockText.trim() === "#" &&
//       selection.getStartOffset() === 1
//     ) {
//       // Handle heading formatting
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         "",
//         editorState.getCurrentInlineStyle(),
//         currentBlock.getType()
//       );
//       const newEditorState = EditorState.push(
//         editorState,
//         newContentState,
//         "change-block-type"
//       );
//       const newStateWithHeader = RichUtils.toggleBlockType(
//         newEditorState,
//         "header-one"
//       );
//       setEditorState(newStateWithHeader);
//       return "handled";
//     }

//     // Apply bold formatting when '*' followed by space
//     if (
//       chars === " " &&
//       blockText.trim() === "*" &&
//       selection.getStartOffset() === 1
//     ) {
//       // Handle bold formatting
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 1,
//         }),
//         "",
//         editorState.getCurrentInlineStyle(),
//         currentBlock.getType()
//       );
//       const newStateWithBold = RichUtils.toggleInlineStyle(
//         EditorState.push(editorState, newContentState, "change-inline-style"),
//         "BOLD"
//       );
//       setEditorState(newStateWithBold);
//       return "handled";
//     }

//     if (
//       chars === " " &&
//       blockText.trim() === "***" &&
//       selection.getStartOffset() === 3
//     ) {
//       // Handle bold formatting
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         selection.merge({
//           anchorOffset: 0,
//           focusOffset: 3,
//         }),
//         "",
//         editorState.getCurrentInlineStyle(),
//         currentBlock.getType()
//       );
//       const newStateWithBold = RichUtils.toggleInlineStyle(
//         EditorState.push(editorState, newContentState, "change-inline-style"),
//         "UNDERLINE"
//       );
//       setEditorState(newStateWithBold);
//       return "handled";
//     }

//     // Apply red text color when '**' followed by space
//     if (
//       chars === " " &&
//       blockText.trim().endsWith("**") &&
//       selection.getStartOffset() === blockText.trim().length
//     ) {
//       const selectionWithSpace = selection.merge({
//         anchorOffset: selection.getStartOffset() - 2,
//         focusOffset: selection.getStartOffset(),
//       });
//       const contentStateWithRedText = Modifier.applyInlineStyle(
//         currentContent,
//         selectionWithSpace,
//         "RED_TEXT" // Use the correct inline style name
//       );
//       const newStateWithRedText = EditorState.push(
//         editorState,
//         contentStateWithRedText,
//         "change-inline-style"
//       );
//       setEditorState(newStateWithRedText);
//       return "handled";
//     }

//     // Remove the two asterisks if a space is entered after them
//     if (chars === " " && blockText.trim().endsWith("**")) {
//       const newContentState = Modifier.replaceText(
//         currentContent,
//         selection.merge({
//           anchorOffset: selection.getStartOffset() - 2,
//           focusOffset: selection.getStartOffset(),
//         }),
//         "",
//         editorState.getCurrentInlineStyle(),
//         currentBlock.getType()
//       );
//       const newStateWithoutAsterisks = EditorState.push(
//         editorState,
//         newContentState,
//         "change-inline-style"
//       );
//       setEditorState(newStateWithoutAsterisks);
//       return "handled";
//     }

//     // Reset formatting state if starting from a new line
//     if (chars === "\n" && selection.getStartOffset() === 0) {
//       // Reset formatting by setting the block type to 'unstyled'
//       const newState = RichUtils.toggleBlockType(editorState, "unstyled");
//       setEditorState(newState);
//       return "handled";
//     }

//     return "not-handled";
//   };

//   const handleSave = () => {
//     saveEditorState();
//     alert("Editor state saved successfully!");
//   };

//   return (
//     <div
//       style={{
//         margin: "20px",
//         border: "1px solid #ccc",
//         borderRadius: "5px",
//         padding: "10px",
//       }}
//     >
//       <div style={{ marginBottom: "10px" }}>
//         <button onClick={handleSave} style={{ marginLeft: "10px" }}>
//           Save
//         </button>
//       </div>
//       <div
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: "5px",
//           minHeight: "200px",
//           padding: "10px",
//         }}
//       >
//         <Editor
//           editorState={editorState}
//           onChange={handleInputChange}
//           handleKeyCommand={handleKeyCommand}
//           keyBindingFn={mapKeyToEditorCommand}
//           handleBeforeInput={handleBeforeInput}
//           customStyleMap={customStyleMap} // Pass customStyleMap here
//         />
//       </div>
//     </div>
//   );
// };

// export default TextEditor;


import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";
// import "./styles.css"; // Import your CSS file with styles

// Define custom text styles
const customStyleMap = {
  RED_TEXT: {
    color: "red",
  },
};

// TextEditor component
const TextEditor = () => {
  // State to manage editor content
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Load editor state from localStorage on component mount
  useEffect(() => {
    const storedEditorState = localStorage.getItem("editorState");
    if (storedEditorState) {
      try {
        const parsedState = JSON.parse(storedEditorState);
        if (typeof parsedState === "string") {
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromText(parsedState)
            )
          );
        } else {
          console.error("Stored editor state is not a string:", parsedState);
        }
      } catch (error) {
        console.error("Error parsing stored editor state:", error);
      }
    }
  }, []);

  // Save editor state to localStorage
  const saveEditorState = () => {
    localStorage.setItem(
      "editorState",
      JSON.stringify(editorState.getCurrentContent().getPlainText())
    );
  };

  // Handle keyboard commands
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Map keyboard keys to editor commands
  const mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  // Handle changes in editor input
  const handleInputChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  // Handle input before it's inserted into the editor
  const handleBeforeInput = (chars, editorState) => {
    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();

    // Convert to Heading 1 format when '#' followed by space
    if (
      chars === " " &&
      blockText.trim() === "#" &&
      selection.getStartOffset() === 1
    ) {
      // Handle heading formatting
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "",
        editorState.getCurrentInlineStyle(),
        currentBlock.getType()
      );
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "change-block-type"
      );
      const newStateWithHeader = RichUtils.toggleBlockType(
        newEditorState,
        "header-one"
      );
      setEditorState(newStateWithHeader);
      return "handled";
    }

    // Apply bold formatting when '*' followed by space
    if (
      chars === " " &&
      blockText.trim() === "*" &&
      selection.getStartOffset() === 1
    ) {
      // Handle bold formatting
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 1,
        }),
        "",
        editorState.getCurrentInlineStyle(),
        currentBlock.getType()
      );
      const newStateWithBold = RichUtils.toggleInlineStyle(
        EditorState.push(editorState, newContentState, "change-inline-style"),
        "BOLD"
      );
      setEditorState(newStateWithBold);
      return "handled";
    }

    if (
      chars === " " &&
      blockText.trim() === "***" &&
      selection.getStartOffset() === 3
    ) {
      // Handle bold formatting
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: 0,
          focusOffset: 3,
        }),
        "",
        editorState.getCurrentInlineStyle(),
        currentBlock.getType()
      );
      const newStateWithBold = RichUtils.toggleInlineStyle(
        EditorState.push(editorState, newContentState, "change-inline-style"),
        "UNDERLINE"
      );
      setEditorState(newStateWithBold);
      return "handled";
    }

    // Apply red text color when '**' followed by space
    if (
      chars === " " &&
      blockText.trim().endsWith("**") &&
      selection.getStartOffset() === blockText.trim().length
    ) {
      const selectionWithSpace = selection.merge({
        anchorOffset: selection.getStartOffset() - 2,
        focusOffset: selection.getStartOffset(),
      });
      const contentStateWithRedText = Modifier.applyInlineStyle(
        currentContent,
        selectionWithSpace,
        "RED_TEXT" // Use the correct inline style name
      );
      const newStateWithRedText = EditorState.push(
        editorState,
        contentStateWithRedText,
        "change-inline-style"
      );
      setEditorState(newStateWithRedText);
      return "handled";
    }

    // Remove the two asterisks if a space is entered after them
    if (chars === " " && blockText.trim().endsWith("**")) {
      const newContentState = Modifier.replaceText(
        currentContent,
        selection.merge({
          anchorOffset: selection.getStartOffset() - 2,
          focusOffset: selection.getStartOffset(),
        }),
        "",
        editorState.getCurrentInlineStyle(),
        currentBlock.getType()
      );
      const newStateWithoutAsterisks = EditorState.push(
        editorState,
        newContentState,
        "change-inline-style"
      );
      setEditorState(newStateWithoutAsterisks);
      return "handled";
    }

    // Reset formatting state if starting from a new line
    if (chars === "\n" && selection.getStartOffset() === 0) {
      // Reset formatting by setting the block type to 'unstyled'
      const newState = RichUtils.toggleBlockType(editorState, "unstyled");
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  // Handle save button click
  const handleSave = () => {
    saveEditorState();
    alert("Editor state saved successfully!");
  };

  // Render the TextEditor component
  return (
    <div
      style={{
        margin: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <button onClick={handleSave} style={{ marginLeft: "10px" }}>
          Save
        </button>
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          minHeight: "200px",
          padding: "10px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={handleInputChange}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={customStyleMap} // Pass customStyleMap here
        />
      </div>
    </div>
  );
};

export default TextEditor;
