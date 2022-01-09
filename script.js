window.addEventListener("load", () => quiz.init())

const quiz = {
    init : function() {
        this.buildBody('Quiz', 'Rudolf Baun');
    },

    buildBody: function(title, name) {

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

    

    createElement: (tag, htmlClass = '', htmlId = '') => {
        const element = document.createElement(tag);

        //TODO is this ok
        htmlClass != '' ? element.classList.add(htmlClass) : false;

        htmlId != '' ? element.id = htmlId : false;

        return element;
    }
}