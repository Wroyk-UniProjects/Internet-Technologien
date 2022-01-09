window.addEventListener("load", () => quiz.init())

const quiz = {

    init : function() {
        this.setupBody('Quiz', 'Rudolf Baun');

        //this.setupLoginScreen();
        this.cycleThrowScreens();
    },

    setupBody: function(title, name) {

        document.body.appendChild(this.buildHeader(title, name));

        this.mainElement = this.createElement('main');
        document.body.appendChild(this.mainElement);

        document.body.appendChild(this.buildFooter(name));

    },

    buildHeader: function(title, name) {
        //const headerElement = document.createElement('header');
        const headerElement = this.createElement('header');
        
        const quizTitle_h1  = this.createElement('h1');
        quizTitle_h1.innerText = title;

        const byName_p = this.createElement('p');
        byName_p.innerText = 'by ' + name;

        headerElement.appendChild(quizTitle_h1);
        headerElement.appendChild(byName_p);

        return headerElement;
    },

    buildFooter: function(name) {
        const footerElement = this.createElement('footer');

        const copyRight_p = this.createElement('p');
        copyRight_p.innerText = '\u00A9 ' + name;//\u00A9 is unicode for the copyright symbol

        footerElement.appendChild(copyRight_p);

        return footerElement;
    },

    setupLoginScreen: function(){
        this.mainElement.textContent = '';

        const loginHold_div = this.createElement('div', 'login_hold');
        const loginForm_form = this.createElement('form');
        const textFields_div = this.createElement('div', 'login_textFields');
        const usernameFiled_input = this.createElement('input');
        const passwordFiled_input = this.createElement('input');
        const loginSubmit_div = this.createElement('div', 'login_submitButton');
        const submitButton_input = this.createElement('input');

        loginHold_div.appendChild(loginForm_form);

        loginForm_form.appendChild(textFields_div);
        loginForm_form.appendChild(loginSubmit_div);

        textFields_div.appendChild(usernameFiled_input);
        usernameFiled_input.type = 'text';
        usernameFiled_input.placeholder = 'Username';
        usernameFiled_input.value = '';

        textFields_div.appendChild(passwordFiled_input);
        passwordFiled_input.type = 'password';
        passwordFiled_input.placeholder = 'Password';
        passwordFiled_input.value = '';

        loginSubmit_div.appendChild(submitButton_input);
        submitButton_input.type = 'button';
        submitButton_input.value = 'Login';
        submitButton_input.addEventListener('click', event => this.clickLoginHandler(event));

        this.mainElement.appendChild(loginHold_div);
        
    },

    setupWaitScreen: function(){
        this.mainElement.textContent = '';

        const animationHold_div = this.createElement('div', 'load_animation');
        const loadBoxBorder_div = this.createElement('div', 'load_bgBox');
        const loadInnerBox_div = this.createElement('div', 'load_fillBox');

        animationHold_div.appendChild(loadBoxBorder_div);

        loadBoxBorder_div.appendChild(loadInnerBox_div);

        this.mainElement.appendChild(animationHold_div);
    },


    waitFor: function(ms){
        return new Promise(resolve =>{
            setTimeout(() => {
                resolve();
            }, ms);
        });
    },

    clickLoginHandler: function (event){
        console.dir(event.path);
    },

    createElement: (tag, htmlId = '', htmlClass = '') => {
        const element = document.createElement(tag);

        //TODO is this ok
        htmlId != '' ? element.id = htmlId : false;

        htmlClass != '' ? element.classList.add(htmlClass) : false;

        return element;
    },

    cycleThrowScreens: async function(){
        const waitTime = 4000;

        while (true) {
            this.setupLoginScreen();

            await this.waitFor(waitTime);

            this.setupWaitScreen();

            await this.waitFor(waitTime)
        }
        
    }
}