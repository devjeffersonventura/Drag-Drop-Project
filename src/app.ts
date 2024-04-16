class ProjectInput {
    templateElement : HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLElement;

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
        this.attach();
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const renderProjectInput = new ProjectInput();