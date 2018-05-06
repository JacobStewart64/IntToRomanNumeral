const invalidtovalidmap = {
    I: 'IV',
    V: 'VX',
    X: 'XL',
    C: 'CD',
    D: 'DM',
};

const nexthighest = {
    I: 'V',
    X: 'L',
    C: 'D',
};

const replacenexthighest = {
    I: 'IX',
    C: 'CM',
    X: 'XC',
    C: 'CM',
};

/* PERFORMANCE NOTES - nearly 100% of the execution time is spent
    generating and concatting and transmitting strings of Ms to
    the main thread. */

//"compile" an int to a Roman Numeral!
//I thought of this after working on
//a compiler for a while. Previously
//the problem stumped me. The Realization
//was that an invalid roman numeral is
//useful as an intermediate to solving
//the problem. I just wanted to solve
//it as efficiently as possible, and
//disregarded loads of branching as very poor
//although that is a fine solution as well.
//I new how to generate this intermediate
//but couldn't see the use until I compilered.
const intToRomanNumeral = (str) => {
    //make new output node
    var cNode = output.cloneNode(false);
    output.parentNode.replaceChild(cNode ,output);
    
    //if str is all digits
    if (/^\d+$/.test(str)) {
        //generate the intermediate (invalid - doesn't follow rule)
        let inputnum = +str;
        if (inputnum > 99999999999) { //MAX_SAFE_INTEGER: 9007199254740992
            output.textContent = 'YOU MIGHT NOT HAVE ENOUGH MEMORY FOR THAT!';
            return;
        }
        let romannumeral = [];

        let numM = Math.floor(inputnum / 1000);
        if (numM) {
            inputnum -= numM * 1000;
        }

        const numD = Math.floor(inputnum / 500);
        if (numD) {
            inputnum -= numD * 500;
        }

        const numC = Math.floor(inputnum / 100);
        if (numC) {
            inputnum -= numC * 100;
        }

        const numL = Math.floor(inputnum / 50);
        if (numL) {
            inputnum -= numL * 50;
        }

        const numX = Math.floor(inputnum / 10);
        if (numX) {
            inputnum -= numX * 10;
        }

        const numV = Math.floor(inputnum / 5);
        if (numV) {
            inputnum -= numV * 5;
        }

        //our threads have chunked their data completely onto
        //the output
        console.timeEnd('PUSH MS!');

        for (let i = 0; i < numD; ++i) {
            romannumeral.push('D');
        }

        for (let i = 0; i < numC; ++i) {
            romannumeral.push('C');
        }

        for (let i = 0; i < numL; ++i) {
            romannumeral.push('L');
        }

        for (let i = 0; i < numX; ++i) {
            romannumeral.push('X');
        }

        for (let i = 0; i < numV; ++i) {
            romannumeral.push('V');
        }

        for (let i = 0; i < inputnum; ++i) {
            romannumeral.push('I');
        }

        //find invalid strings in the intermediate
        //generate an array of new str segments to be joined
        //use our maps to replace the invalid strings with their valid forms    
        let validromannumeral = [];
        for (let i = 0; i < numM; ++i) {
            validromannumeral.push('M');
        }
        let count = 0;
        let lastnumeral = romannumeral[0];
        validromannumeral.push(lastnumeral);
        for (let i = 1;i < romannumeral.length; ++i) {
            if (lastnumeral === romannumeral[i]) {
                if (count === 2) {
                    count = 0;
                    validromannumeral.pop();
                    validromannumeral.pop();
                    validromannumeral.pop();
                    if (nexthighest[romannumeral[i]]) {
                        if (validromannumeral[validromannumeral.length-1] === nexthighest[romannumeral[i]]) {
                            validromannumeral.pop();
                            validromannumeral.push(replacenexthighest[romannumeral[i]]);
                        }
                        else {
                            validromannumeral.push(invalidtovalidmap[romannumeral[i]]);
                        }                       
                    }
                    else {
                        validromannumeral.push(invalidtovalidmap[romannumeral[i]]);
                    }
                }
                else {
                    ++count;
                    validromannumeral.push(romannumeral[i]); 
                }                    
            }
            else {
                lastnumeral = romannumeral[i];
                count = 0;
                validromannumeral.push(romannumeral[i]);
            }
        }
        output.appendChild(document.createTextNode(validromannumeral.join("")));
    }
    else {
        //input had other chars than digits
        output.textContent = 'INVALID INTEGER';
        return;
    }
}

window.onload = () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');

    input.oninput = () => {
        intToRomanNumeral(input.value);
    }
}