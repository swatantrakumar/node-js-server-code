class NumberUtility {
    constructor() {
        this.X = [
            "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
            "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
        ];

        this.Y = [
            "", "", "Twenty ", "Thirty ", "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety "
        ];

        this.EMPTY = "";
    }

    // Function to convert amount in words
    getAmountInWords(n) {
        return this.convert(Math.floor(n));
    }

    // Function to convert integer part to words
    convert(n) {
        let res = '';

        res += this.convertToDigit(Math.floor((n / 100000) % 100), "Lakh, ");
        res += this.convertToDigit(Math.floor((n / 1000) % 100), "Thousand ");
        res += this.convertToDigit(Math.floor((n / 100) % 10), "Hundred ");

        if (n > 100 && n % 100 !== 0) {
            res += "and ";
        }
        res += this.convertToDigit(n % 100, '');

        return res.trim();
    }

    // Helper function to convert digits to words with suffix
    convertToDigit(n, suffix) {
        if (n === 0) {
            return this.EMPTY;
        }
        if (n > 19) {
            return this.Y[Math.floor(n / 10)] + this.X[n % 10] + suffix;
        } else {
            return this.X[n] + suffix;
        }
    }
}

// Export the class as a module
module.exports = NumberUtility;