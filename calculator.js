/*
    Facilitas Calculator
    Calculator Control
    Handles operations of the calculator.
*/

/// Imports
const { evaluate } = require('mathjs');

/// Variables
var MATH_SCOPE = {};

/// Functions
// Builds a section with the specified title and items
// title -> The title of the section
// items -> A dictionary of the items to show and what they add to the input
//  ex: {displayText: 'Text to add to input'}
// tag -> Null or a string to be added as a class to the main container
function buildSection(title, items, tag = null) {
    // Create the main div container
    var mainContainer = document.createElement('div');

    // Check if a tag is provided
    if(tag !== null) {
        // Add the tag as a class
        mainContainer.classList.add(tag);
    }

    // Create a p element
    var titleElement = document.createElement('p');
    titleElement.textContent = title;

    // Add the p element to the main container
    mainContainer.appendChild(titleElement);

    // Create the options container
    var optionsContainer = buildSectionItems(items);

    // Add to the main div container
    mainContainer.appendChild(optionsContainer);

    // Add the main container to the page
    document.getElementById('choiceItems').appendChild(mainContainer);
}

// Builds an item set to be displayed by a section
// items -> A dictionary of the items to show and what they add to the input
function buildSectionItems(items) {
    // Create the options container
    var optionsContainer = document.createElement('ul');

    // Get the keys
    var keys = Object.keys(items)

    // Check if there are keys present
    if(Object.keys(items).length > 0) {
        // Loop through the provided items
        for(const key of keys) {
            // Create a list element
            var optionElement = document.createElement('li');
            optionElement.textContent = key;

            // Add click listener to add to the current input
            optionElement.addEventListener('click', () => {
                addToCurrentInput(items[key]);
            });

            // Add to the options container
            optionsContainer.appendChild(optionElement);
        }
    } else {
        // Create an empty element
        var optionElement = document.createElement('li');
        optionElement.textContent = 'No Items';
        optionElement.classList.add('empty');

        // Add to the options container
        optionsContainer.appendChild(optionElement);
    }

    // Return the options container
    return optionsContainer;
}

// Creates a new calculation input
function createNewInput() {
    // Create the input container element
    var container = document.createElement('li');

    // Create the text input
    var textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('value', '');
    textInput.setAttribute('placeholder', '...');

    // Add input listener for resize
    textInput.addEventListener('input', resizeInputWithThis);

    // Add input listener for 
    textInput.addEventListener('input', (event) => {
        calculateResultForCurrentInput(event.target);
    });

    // Add the input to the container
    container.appendChild(textInput);

    // Create the output span
    var spanOutput = document.createElement('span');
    spanOutput.textContent = 'No Input';
    spanOutput.classList.add('output');
    spanOutput.classList.add('err');

    // Add the output span
    container.appendChild(spanOutput);

    // Add the input to the page
    document.getElementById('equations').appendChild(container);

    // Resize to fit the starting size
    resizeInput(textInput);
}

// Calls the resize with 'this' as a target
function resizeInputWithThis() {
    // Call the other function
    resizeInput(this);
}

// Calls the resize with the provided target
function resizeInput(target) {
    // Get the font size
    var fontSize = window.getComputedStyle(target).getPropertyValue('font-size');
    fontSize = fontSize.substring(0, fontSize.length-2);
    fontSize = parseInt(fontSize);

    // Assign the width property based on hide text
    target.style.width = (String(target.value.length*(fontSize-5))+'px');
}

// Calculates and assigns the result for the current input
function calculateResultForCurrentInput(target) {
    // Get the result sibling
    var spanResult = target.nextSibling;

    // Enter the try/catch
    try {
        // Calculate the value based on input
        var mathResult = evaluate(target.value, MATH_SCOPE);

        // Check if math result is undefined
        if(mathResult === undefined || typeof(mathResult) === 'function') {
            // Update the span result as an error
            spanResult.textContent = 'No Input';
            spanResult.classList.add('err');
        } else {
            // Update the span result as the value
            spanResult.textContent = String(mathResult);
            spanResult.classList.remove('err');
        }
    } catch(err) {
        // Update the span result as an error
        spanResult.textContent = 'No Input';
        spanResult.classList.add('err');
    }
}

// Inserts the provided text into the input
function addToCurrentInput(txt) {
    // Get the last child of the equations
    var currentInput = document.getElementById('equations').lastChild.querySelector('input');

    // Add the current bit to the input
    currentInput.value = currentInput.value+txt;

    // Resize the input
    resizeInput(currentInput);

    // Calculate the result
    calculateResultForCurrentInput(currentInput);
}

// Removes the specified amount of characters from the end of the current input.
// If the number exceeds the length of the current input, it removes the whole text.
function removeFromCurrentInput(amount) {
    // Get the last child of the equations
    var currentInput = document.getElementById('equations').lastChild.querySelector('input');

    // Check the length of the current input
    if(currentInput.value.length < amount) {
        // Assign amount to the total length
        amount = currentInput.value.length;
    }

    // Alter the value
    currentInput.value = currentInput.value.slice(0, -amount);

    // Resize the input
    resizeInput(currentInput);

    // Calculate the result
    calculateResultForCurrentInput(currentInput);
}

// Assigns the click actions to the buttons within the keypad
function readyKeypad() {
    // Loop through the buttons in the keypad
    for(const btn of document.querySelectorAll('#buttons > button')) {
        // Check if a special input
        switch(btn.textContent) {
            case '←':
                // Assign a listener to remove last character
                btn.addEventListener('click', () => {
                    removeFromCurrentInput(1);
                });
                break;
        
            default:
                // Just add the text the button represents
                btn.addEventListener('click', () => {
                    addToCurrentInput(btn.textContent);
                });
                break;
        }
    }
}

/// Setup Function
// Function that sets up the calculator
function setup() {
    // Populate the sections
    buildSection('Trigonometry', {
        sin: 'sin(a)',
        cos: 'cos(a)',
        tan: 'tan(a)',
        sec: 'sec(a)',
        csc: 'csc(a)',
        cot: 'cot(a)',
        asin: 'asin(a)',
        acos: 'acos(a)',
        atan: 'atan(a)'
    });

    buildSection('Functions', {
        sqrt: 'sqrt(a)',
        power: '^2',
        absolute: 'abs(a)',
        ceil: 'ceil(a)',
        floor: 'floor(a)',
        phi: 'phi',
        pi: 'pi',
        e: 'e',
        gcd: 'gcd(a, b)',
        variable: 'a = '
    });

    buildSection('Variables', MATH_SCOPE, 'vars');

    // Prepare the keypad buttons
    readyKeypad();

    // Create a new equation input
    createNewInput();

    // TODO: Add listeners to Enter Grid Button and Enter Key to finish current input
        // TODO: Move old input up to a stagnant display (with a click listener to copy result?)
        // TODO: Create new input (as above)
}

// Setup the calculator
setup();