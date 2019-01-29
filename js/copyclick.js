const copyButton = document.querySelector(".menu_copy");
const copyInput = document.querySelector(".menu__url");

copyButton.addEventListener("click", function () {
    if (navigator.clipboard) {
      let code = copyInput.value;
      navigator.clipboard.writeText(code)
        .then(function () {
          console.log("Navigator: Copying to clipboard was successful!");
        })
        .catch(function (err) {
          console.log("Navigator: Something went wrong", err);
        })
    } else {
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        let editable = copyInput.contentEditable;
        let readOnly = copyInput.readOnly;

        copyInput.contentEditable = true;
        copyInput.readOnly = true;

        let range = document.createRange();
        range.selectNodeContents(copyInput);

        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copyInput.setSelectionRange(0, 999999);

        copyInput.contentEditable = editable;
        copyInput.readOnly = readOnly;

        document.execCommand("copy");

      } else {

        copyInput.focus();
        copyInput.select();

        try {
          let success = document.execCommand("copy");
          let msg = success ? "successful" : "not successful";
          console.log("Exec Command: Copying to clipboard was " + msg);
        } catch (err) {
          console.log("Exec Command: Something went wrong");
        }

      }

      window.getSelection().removeAllRanges();

      copyInput.classList.add("active");
    }
  }
);
