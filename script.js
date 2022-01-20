window.addEventListener("load", () => quiz.init())

const quiz = {
    demoQuestionText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et',

    apiURL: 'https://www2.hs-esslingen.de/~melcher/internet-technologien/quiz/',

    passwordValid: false,
    usernameValid: false,
    errorMessage: '',

    token: null,
    themes: [],
    chapters:[],
    selectedTheme: null,
    selectedChapter: null,

    init() {
        this.setupBody('Quiz', 'Rudolf Baun');

        this.changeViewState(this.States.loggedOut);
    },
    
    changeViewState(state){
        switch (state) {
            case this.States.loggedOut:
                this.setupLoginScreen();
                break;
            case this.States.loggingIn:
                this.setupWaitScreen();
                break;
            case this.States.loginFailed:
                this.setupLoginScreen();
                alert(this.errorMessage)
                break;
            case this.States.gettingThemes:
                this.requestThemes();
                break;
            case this.States.selectTheme:
                this.setupCategorySelectScreen(this.themes, this.chapters);
                break;
            case this.States.gettingChapters:
                this.requestChapters();
                break;
            case this.States.selectChapter:
                this.setupCategorySelectScreen(this.themes, this.chapters);
                break;
            default:
                alert('Unhandled state \'' + state + '\'');
                break;
        }
    },

    States: {
        loggedOut : 'logged out',
        loggingIn : 'logging in',
        loggedIn : 'logged in',
        loginFailed: ' login failed',
        gettingThemes: 'getting themes',
        gettingThemesFailed: 'getting themes failed',
        selectTheme: 'select theme',
        gettingChapters: 'getting chapters',
        gettingChaptersFails: 'getting chapters failed',
        selectChapter: 'select chapter'
    },

    setupBody: function(title, name) {

        document.body.appendChild(this.buildHeader(title, name));

        this.mainElement = this.createElement('main');
        document.body.appendChild(this.mainElement);

        document.body.appendChild(this.buildFooter(name));

    },

    buildHeader: function(title, name) {
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
        usernameFiled_input.placeholder = 'Username (>5 chars)';
        usernameFiled_input.value = '';

        usernameFiled_input.addEventListener('input', event => this.validateOnInput(event , 'username'))

        textFields_div.appendChild(passwordFiled_input);
        passwordFiled_input.type = 'password';
        passwordFiled_input.placeholder = 'Password (>5 chars)';
        passwordFiled_input.value = '';

        passwordFiled_input.addEventListener('input', event => this.validateOnInput(event, 'password'))

        loginSubmit_div.appendChild(submitButton_input);
        submitButton_input.type = 'button';
        submitButton_input.value = 'Login';
        submitButton_input.disabled = true;
        submitButton_input.addEventListener('click', event => this.clickLoginHandler(event, usernameFiled_input, passwordFiled_input));

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

    buildCategoryForm: function(themes, chapters){
        const category_form = this.createElement('form', 'category_form');

        const theme_select = this.createElement('select', '', 'theme');
        const chapter_select = this.createElement('select','','chapter');

        
        const empty_theme_option = this.createElement('option');
        empty_theme_option.innerText = "No Theme";
        empty_theme_option.value = null;
        theme_select.appendChild(empty_theme_option);
    
        themes.forEach( theme => {
            const theme_option = this.createElement('option');
            theme_option.innerText = theme.name;
            theme_option.value = theme.id;
            if (this.selectedTheme == theme.id){
                theme_option.selected = true;
            }
            theme_select.appendChild(theme_option);
        })
        
        theme_select.disabled = this.selectedTheme != null;
        theme_select.addEventListener('input', event => this.selectThemeHandler(event));
        category_form.appendChild(theme_select);

       
    
        const empty_chapter_option = this.createElement('option');
        empty_chapter_option.innerText = "No Chapter";
        empty_chapter_option.value = null;
        chapter_select.appendChild(empty_chapter_option);
        chapter_select.disabled = this.selectedTheme == null;

        chapters.forEach( chapter =>{
            const chapter_option = this.createElement('option');
            chapter_option.innerText = chapter.id;
            chapter_option.value = chapter.name;
            if (this.selectedTheme == chapter.id){
                theme_option.selected = true;
            }
            chapter_select.appendChild(chapter_option);
        })
        
        chapter_select.disabled = this.selectedChapter != null || this.selectedTheme == null;
        chapter_select.addEventListener('input', event => this.selectThemeHandler(event))
        category_form.appendChild(chapter_select);

        return category_form;
    },

    setupCategorySelectScreen: function(themes, chapters){
        this.mainElement.textContent = '';

        const contentContainer_div = this.createElement('div', 'contentContainer', 'category');
        const text_box_div = this.createElement('div', 'text_box');
        
        const category_form = this.buildCategoryForm(themes, chapters)
        
        
        contentContainer_div.appendChild(category_form)

        
        contentContainer_div.appendChild(text_box_div)

        const info_text_p = this.createElement('p')
        info_text_p.innerText = 'Choose a theme and chapter'

        text_box_div.appendChild(info_text_p)


        this.mainElement.appendChild(contentContainer_div)
    },

    setupQuestionsScreen: function(themes, chapters, question, answers){
        this.mainElement.textContent = '';

        const contentContainer_div = this.createElement('div', 'contentContainer', 'questions');
        const question_div = this.createElement('div', 'text_box');
        const question_form = this.createElement('form', 'question_form');
        const answers_div = this.createElement('div', 'question_answers');
        const answers_buttons_div = this.createElement('div', 'question_buttons');

        const category_form = this.buildCategoryForm(themes, chapters);
        contentContainer_div.appendChild(category_form);


        const question_text_p = this.createElement('p');
        question_text_p.innerText = question;
        question_div.appendChild(question_text_p);

        contentContainer_div.appendChild(question_div);


        for (let i = 0; i < answers; i++){
            //temp for Lab 2
            const label = this.createElement('label');

            const input = this.createElement('input');
            input.name = (i+1).toString();
            input.type = 'checkbox';
            input.value = i+1;
            label.appendChild(input);

            label.appendChild(document.createTextNode((i+1).toString() + '. answer'));

            answers_div.appendChild(label);
        }

        question_form.appendChild(answers_div);

        const submit_input = this.createElement('input', 'question_submit');
        submit_input.type = 'submit';
        submit_input.value = 'Answer';
        answers_buttons_div.appendChild(submit_input);
        question_form.appendChild(answers_buttons_div);

        contentContainer_div.appendChild(question_form);


        this.mainElement.appendChild(contentContainer_div);
    },

    setupResultScreen: function(themes, chapters, correct){
        this.mainElement.textContent = '';

        const contentContainer_div = this.createElement('div', 'contentContainer', 'result');

        const category_form = this.buildCategoryForm(themes, chapters);
        contentContainer_div.appendChild(category_form);

        const result_box_div = this.createElement('div', 'result_box');
        const result_image_img = this.createElement('img');
        result_image_img.width = 300;
        result_image_img.height = 300;

        if (correct){
            result_image_img.src = 'images/verified_black_24dp.svg';
            result_image_img.alt = 'correct';
        }else{
            result_image_img.src = 'images/dangerous_black_24dp.svg';
            result_image_img.alt = 'wrong';
        }

        result_box_div.appendChild(result_image_img);
        contentContainer_div.appendChild(result_box_div);


        const button_hold_div = this.createElement('div', 'result_button_hold');

        const result_repeat_button =this.createElement('button', 'result_repeat');
        result_repeat_button.innerText = 'Repeat';
        button_hold_div.appendChild(result_repeat_button);

        const result_next_button =this.createElement('button', 'result_next');
        result_next_button.innerText = 'Next';
        button_hold_div.appendChild(result_next_button);

        const result_reset_button =this.createElement('button', 'result_reset');
        result_reset_button.innerText = 'Reset Chapter';
        button_hold_div.appendChild(result_reset_button);

        contentContainer_div.appendChild(button_hold_div);

        this.mainElement.appendChild(contentContainer_div);
    },

    setupSummeryScreen: function(themes, chapters, summery){
        this.mainElement.textContent = '';

        const contentContainer_div = this.createElement('div', 'contentContainer', 'summery');

        const category_form = this.buildCategoryForm(themes, chapters);
        contentContainer_div.appendChild(category_form);


        const summery_hold_div = this.createElement('div', 'summery_hold');

        const chart_div =this.createElement('div', '', 'chart');
        chart_div.style = '--correct: '+ summery[0] + '%;--wrong: '+ summery[0] + '%;';

        const correct_text_p = this.createElement('p','correct');
        correct_text_p.innerText = summery[0] + '% correct';

        const wrong_text_p = this.createElement('p','wrong');
        wrong_text_p.innerText = summery[1] + '% wrong';

        const summery_categories_div = this.createElement('div', 'categories');

        const theme_text_p = this.createElement('p', 'theme');
        theme_text_p.innerText = 'Demo theme';

        const chapter_text_p = this.createElement('p', 'chapter');
        chapter_text_p.innerText = 'Demo chapter';

        summery_categories_div.appendChild(theme_text_p);
        summery_categories_div.appendChild(chapter_text_p);

        chart_div.appendChild(correct_text_p);
        chart_div.appendChild(wrong_text_p);

        chart_div.appendChild(summery_categories_div);

        summery_hold_div.appendChild(chart_div);
        contentContainer_div.appendChild(summery_hold_div);


        this.mainElement.appendChild(contentContainer_div);
    },


    waitFor: function(ms){
        return new Promise(resolve =>{
            setTimeout(() => {
                resolve();
            }, ms);
        });
    },

    clickLoginHandler: function (event, usernameFiled, passwordFiled){
        console.log(event);
        console.log(usernameFiled.value);
        console.log(passwordFiled.value);
        this.sentLoginRequest(usernameFiled.value, passwordFiled.value);

    },

    selectThemeHandler(event){
        this.selectedTheme = event.target.value;
        this.changeViewState(this.States.gettingChapters);
    },

    selectChapterHandler(event){
        this.selectedChapter = event.target.value;
        this.changeViewState(this.States.selectTheme);
    },

    validateOnInput: function (event, inputFiled){
        const button = document.getElementById('login_submitButton').firstChild;

        if(event.target.value.length  > 5){
            inputFiled != 'username' ? this.usernameValid = true: this.passwordValid = true;
            event.target.classList.remove('invalided');
        }
        else{
            inputFiled != 'username' ? this.usernameValid = false: this.passwordValid = false;
            event.target.classList.add('invalided');
        }

        this.usernameValid && this.passwordValid ? button.disabled = false: button.disabled = true;
    },

    createElement: (tag, htmlId = '', htmlClass = '') => {
        const element = document.createElement(tag);

        //TODO is this ok
        htmlId != '' ? element.id = htmlId : false;

        htmlClass != '' ? element.classList.add(htmlClass) : false;

        return element;
    },

    sentLoginRequest(username, password){
        this.changeViewState(this.States.loggingIn);
        const request = this.apiURL + '?request=login&userid='+ username +'&password='+ password;
        fetch(request)
            .then( response => {
                response.json().then( data =>{
                    if (data.status == 'error'){
                        //console.error(data.status + " " + data.code)
                        this.errorMessage = data.message
                        this.changeViewState(this.States.loginFailed)
                    }else{
                        this.token = data.token
                        this.changeViewState(this.States.gettingThemes)
                    }
        })}).catch(res => this.changeViewState(this.States.loginFailed));
    },

    requestThemes(){
        this.changeViewState(this.States.loggingIn);
        const request = this.apiURL + '?request=getthemes&token='+ this.token;
        fetch(request)
            .then( response => {
                response.json().then( data =>{
                    if (data.status == 'error'){
                        //console.error(data.status + " " + data.code)
                        this.errorMessage = data.message
                        this.changeViewState(this.States.gettingThemesFailed)
                    }else{
                        this.themes = data.themes
                        this.changeViewState(this.States.selectTheme)
                    }
        })}).catch(res => this.changeViewState(this.States.gettingThemesFailed));
    },

    requestChapters(){
        this.changeViewState(this.States.loggingIn);
        const request = this.apiURL + '?request=gettheme&theme='+ this.selectedTheme +'&token='+ this.token;
        fetch(request)
            .then( response => {
                console.log(response)
                response.json().then( data =>{
                    if (data.status == 'error'){
                        //console.error(data.status + " " + data.code)
                        this.errorMessage = data.message
                        this.changeViewState(this.States.gettingChaptersFails)
                    }else{
                        this.chapters = data.chapters
                        this.changeViewState(this.States.selectChapter)
                    }
        })}).catch(res => this.changeViewState(this.States.gettingChaptersFails));
    },

    requestQuestion(){
        this.changeViewState(this.States.loggingIn);
        const request = this.apiURL + '?request=gettheme&theme='+ this.selectedTheme +'&token='+ this.token;
        fetch(request)
            .then( response => {
                console.log(response)
                response.json().then( data =>{
                    if (data.status == 'error'){
                        //console.error(data.status + " " + data.code)
                        this.errorMessage = data.message
                        this.changeViewState(this.States.gettingChaptersFails)
                    }else{
                        this.chapters = data.quiz
                        this.changeViewState(this.States.selectChapter)
                    }
        })}).catch(res => this.changeViewState(this.States.gettingChaptersFails));
    }
}