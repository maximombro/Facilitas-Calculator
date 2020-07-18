/*
    Facilitas Calculator
    Calculator Control
    Handles operations of the calculator.
*/

/// Imports
const { evaluate } = require('mathjs');

/// Variables

/// Functions
// Builds a section with the specified title and items
// title -> The title of the section
// items -> A dictionary of the items to show and what they add to the input
//  ex: {displayText: 'Text to add to input'}
function buildSection(title, items) {
    // Create the main div container
    var mainContainer = document.createElement('div');

    // Create a p element
    var titleElement = document.createElement('p');
    titleElement.textContent = title;

    // Add the p element to the main container
    mainContainer.appendChild(titleElement);

    // Create the options container
    var optionsContainer = document.createElement('ul');

    // Loop through the provided items
    for(const item of Object.keys(items)) {
        // Create a list element
        var optionElement = document.createElement('li');
        optionElement.textContent = item;

        // TODO: Add click listener to add to the current input

        // Add to the options container
        optionsContainer.appendChild(optionElement);
    }

    // Add to the main div container
    mainContainer.appendChild(optionsContainer);

    // Add the main container to the page
    document.getElementById('choiceItems').appendChild(mainContainer);
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
        // Get the result sibling
        var spanResult = event.target.nextSibling;

        // Enter the try/catch
        try {
            // Calculate the value based on input
            var mathResult = evaluate(event.target.value);

            // Check if math result is undefined
            if(mathResult === undefined) {
                // Update the span result
                spanResult.textContent = 'No Input';
                spanResult.classList.add('err');
            } else {
                // Update the span result
                spanResult.textContent = String(mathResult);
                spanResult.classList.remove('err');
            }
        } catch(err) {
            // Update the span result
            spanResult.textContent = 'No Input';
            spanResult.classList.add('err');
        }
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

/// Setup Function
// Function that sets up the calculator
function setup() {
    // Populate the sections
    buildSection('Trigonometry', {
        sin: 'optionA',
        cos: 'optionB',
        tan: 'optionC',
        sec: 'optionD',
        csc: 'optionE',
        cot: 'optionF',
    });

    // TODO: Add click events to the numpad grid buttons to add to the current input

    // Create a new equation input
    createNewInput();

    // TODO: Begin watching the input to calculate per change

    // TODO: Add listeners to Enter Grid Button and Enter Key to finish current input
        // TODO: Move old input up to a stagnant display (with a click listener to copy result?)
        // TODO: Create new input (as above)
}

// Setup the calculator
setup();