interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    const value = validatableInput.value;

    if (validatableInput.required) {
        isValid = value.toString().trim().length !== 0;
    }
    if(typeof value === 'string') {
        if(validatableInput.minLength != null){
            isValid = isValid && value.length >= validatableInput.minLength;
        }
        if(validatableInput.maxLength != null){
            isValid = isValid && value.length <= validatableInput.maxLength;
        }
    }
    if(typeof value === 'number') {
        if(validatableInput.min != null){
            isValid = isValid && value >= validatableInput.min;
        }
        if(validatableInput.max != null){
            isValid = isValid && value <= validatableInput.max;
        }
    }

    return isValid;
}

function autoBind(_target: any, _key: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const boundDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            return method.bind(this);
        }
    };
    return boundDescriptor;
}

class ProjectInput {
    templateElement : HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;	
    peopleInputElement: HTMLInputElement;

    constructor(){
        this.templateElement = document.getElementById(
            'project-input'
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        const importeNode = document.importNode(
            this.templateElement.content,
            true
        );
        this.element = importeNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputElement = this.element.querySelector(
            '#title'
        ) as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
            '#description'
        ) as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector(
            '#people'
        ) as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;    

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ){
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autoBind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }
    private configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const renderProjectInput = new ProjectInput();