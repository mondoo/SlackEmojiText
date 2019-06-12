class SlackRansom {
    constructor(input, output, data) {
        this.$inputField = document.querySelector(input);
        this.$outputField = document.querySelector(output);

        if (!this.$inputField || !this.$outputField) {
            console.log(`${!this.$inputField ? `"${input}" could not be found in the DOM` : ""} ${!this.$outputField ? `${!this.$inputField ? "\n" : ""}"${output}" could not be found in the DOM` : ""}`);
        }
        else {
            this.characterMap = data.characterMap;
            this.brands = data.brands;
            this.punctuation = data.punctuation;
            this.output;
            this.bindInput();
        }
    }

    toEmojis(inStr) {
        let alphaNumericRegex = /[a-z0-9]/i;
        let outputStr = "";
        for (let i = 0; i < inStr.length; i++) {
            if (this.characterMap[inStr[i].toLowerCase()]) {
                outputStr += this.characterMap[inStr[i].toLowerCase()];
            }
            else if (alphaNumericRegex.test(inStr[i])) {
                outputStr += `:${inStr[i].toLowerCase()}:`;
            }
            else {
                outputStr += inStr[i];
            }
        }
        return outputStr;
    }

    validationCheck(inArr) {
        if (!Array.isArray(inArr)) {
            return false;
        }
        for (let i = 0; i < inArr.length; i++) {
            if (inArr[i]) {
                return true;
            }
        }
        return false;
    }

    formatSlackString(inStr) {
        this.output = this.toEmojis(inStr);
        Object.keys(this.brands).forEach((brand) => {
            const strToReplace = this.toEmojis(brand);
            this.output = this.output.replace(new RegExp(strToReplace, "g"), (match, idx) => {
                let punctuationValidation = [false, false];
                for (let i = 0; i < this.punctuation.length; i++) {
                    const punctuationEmoji = this.toEmojis(this.punctuation[i]);
                    const punctuationSlice = [
                        this.output.slice(idx - punctuationEmoji.length, idx),
                        this.output.slice(strToReplace.length + idx, strToReplace.length + idx + punctuationEmoji.length)
                    ];

                    if (punctuationSlice[0] == punctuationEmoji) {
                        punctuationValidation[0] = true;
                    }
    
                    if (punctuationSlice[1] == punctuationEmoji) {
                        punctuationValidation[1] = true;
                    }
    
                    if (punctuationValidation[0] && punctuationValidation[1]) {
                        break;
                    }
                }
    
                return this.validationCheck([
                    idx == 0 && !this.output[strToReplace.length + idx + 1],
                    punctuationValidation[0] && punctuationValidation[1],
                    punctuationValidation[0] && (!this.output[strToReplace.length + idx + 1] || this.output[strToReplace.length + idx + 1] == " "),
                    punctuationValidation[1] && (!this.output[idx - 1] || this.output[idx - 1] == " "),
                    (!this.output[idx - 1] || this.output[idx - 1] == " ") && (!this.output[strToReplace.length + idx + 1] || this.output[strToReplace.length + idx + 1] == " ")
                ]) ? this.brands[brand] : strToReplace;
            });
        });
    }

    bindInput() {
        this.$inputField.addEventListener('input', (evt) => {
            this.formatSlackString(evt.target.value);
            this.$outputField.innerHTML = this.output;
        });
    }
}
