class SlackRansom {
    constructor(input, output, characterMap, brands, punctuation) {
        this.$inputField = document.querySelector(input);
        this.$outputField = document.querySelector(output);

        if (!this.$inputField || !this.$outputField) {
            console.log(`${!this.$inputField ? `"${input}" could not be found in the DOM` : ""} ${!this.$outputField ? `${!this.$inputField ? "\n" : ""}"${output}" could not be found in the DOM` : ""}`);
        }
        else {
            this.characterMap = characterMap;
            this.brands = brands;
            this.punctuation = punctuation;
            this.bindInput();
        }
    }

    toEmojis(inStr) {
        let alphaNumericRegex = /[a-z0-9]/i;
        let output = "";
        for (let i = 0; i < inStr.length; i++) {
            if (this.characterMap[inStr[i].toLowerCase()]) {
                output += this.characterMap[inStr[i].toLowerCase()];
            }
            else if (alphaNumericRegex.test(inStr[i])) {
                output += `:${inStr[i].toLowerCase()}:`;
            }
            else {
                output += inStr[i];
            }
        }
        return output;
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
        let output = this.toEmojis(inStr);
        Object.keys(this.brands).forEach((brand) => {
            const strToReplace = this.toEmojis(brand);
            output = output.replace(new RegExp(strToReplace, "g"), (match, idx) => {
                let punctuationPrevValidation = false;
                let punctuationNextValidation = false;
                for (let i = 0; i < this.punctuation.length; i++) {
                    const punctuationEmoji = this.toEmojis(this.punctuation[i]);
                    const prevPunctuationSlice = output.slice(idx - punctuationEmoji.length, idx);
                    const nextPunctuationSlice = output.slice(strToReplace.length + idx, strToReplace.length + idx + punctuationEmoji.length);
    
                    if (prevPunctuationSlice == punctuationEmoji) {
                        punctuationPrevValidation = true;
                    }
    
                    if(nextPunctuationSlice == punctuationEmoji) {
                        punctuationNextValidation = true;
                    }
    
                    if (punctuationPrevValidation && punctuationNextValidation) {
                        break;
                    }
                }
    
                return this.validationCheck([
                    idx == 0 && !output[strToReplace.length + idx + 1],
                    punctuationPrevValidation && punctuationNextValidation,
                    punctuationPrevValidation && (!output[strToReplace.length + idx + 1] || output[strToReplace.length + idx + 1] == " "),
                    punctuationNextValidation && (!output[idx - 1] || output[idx - 1] == " "),
                    (!output[idx - 1] || output[idx - 1] == " ") && (!output[strToReplace.length + idx + 1] || output[strToReplace.length + idx + 1] == " ")
                ]) ? this.brands[brand] : strToReplace;
            });
        });
    
        return output;
    }

    bindInput() {
        if (this.$inputField && this.$outputField) {
            this.$inputField.addEventListener('input', (evt) => {
                this.$outputField.innerHTML = this.formatSlackString(evt.target.value);
            });
        }
    }
}
