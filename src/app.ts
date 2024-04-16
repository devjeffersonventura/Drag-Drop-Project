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

        if(
            !enteredTitle.trim() ||
            !enteredDescription.trim() ||
            !enteredPeople.trim()
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