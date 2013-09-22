if(typeof EasyTest == "undefined") {
  var EasyTest                       = {
      containerObject        :  {},
      decorationInformation  :  {
        'clear'        : {
          'clear'      : 'both',
          'padding'    : '0',
          'margin'     : '0',
          'border'     : '0'
        },
        'container'    : {
          'background' : '#ecf0f1',
          'width'      : '96%',
          'max-width'  : '1024px',
          'margin'     : '0 auto',
          'padding'    : '10px 2%'
        },
        'title'        : {
          'color'      : '#e74c3c',
          'text-align' : 'center',
          'font-size'  : '140%'
        },
        'description'  : {
          'color'      : '#3498db',
          'text-align' : 'center',
          'font-size'  : '130%'
        },
        'question-name' : {
          'font-size' : '120%'
        },
        'question-name-number' : {
          'color'         : '#ffffff',
          'background'    : '#e74c3c',
          'border-radius' : '12px',
          'padding'       : '3px 5px'
        },
        'question-answer-option-container' : {
          'float'   : 'left',
          'display' : 'block',
          'padding' : '5px'
        },
        'question-answer-option-label' : {
          'padding'       : '5px 10px',
          'background'    : '#3498db',
          'color'         : '#ffffff',
          'border-radius' : '5px',
          'cursor'        : 'pointer',
          'text-transform': 'capitalize',
          'font-size'     : '120%'
        },
        'question-answer-option-label-not-selected' : {
          'background'    : '#e74c3c'
        },
        'question-answer-option-label-selected' : {
          'background'    : '#2ecc71'
        },
        'question-answer-option-radio' : {
          'display'   : 'none'
        },
        'result-score-container' : {
          'background'    : '#f1c40f',
          'color'         : '#ffffff',
          'font-size'     : '120%',
          'text-align'    : 'center',
          'max-width'     : '640px',
          'display'       : 'block',
          'border-radius' : '5px',
          'margin'        : '0 auto'
        },
        'result-score-container-score' : {
          'color'         : '#d35400'
        },
        'result-list' : {
          'list-style-type' : 'none'
        },
        'result-list-item' : {
          'padding'   : '2px 2.5%',
          'font-size' : '100%',
          'color'     : '#ffffff',
          'background': '#3498db',
          'text-align': 'center',
          'width'     : '80%',
          'margin'    : '0 auto'
        },
        'result-list-item-highlight' : {
          'background' : '#2ecc71',
          'color'      : '#ffffff'
        },
        'notification' : {
          'display' : 'block',
          'padding' : '5px 10px'
        },
        'notification-error' : {
          'color'      : '#ffffff',
          'background' : '#e74c3c'
        },
        'notification-info' : {
          'color'      : '#ffffff',
          'background' : '#3498db'
        }
      },
      information              : {
        "name"                : "",
        "description"         : "",
        "question_split"      : "",
        "questions"           : {},
        "result_information"  : {},
        "score_divide"        : 1,
        "display_score"       : 1
      },
      internalNamespace       : 'easy-test',
      init                     : function(containerObject, information) {
        this.containerObject = containerObject;

        this.containerObject.html(
          this.fetchBasicNotificationHTML('Asteapta cateva momente te rog...', 'info')
        );

        this.containerObject.attr('style', this.fetchInlineCSSByDecorationInformation('container'));

        if(typeof information == "object") {
          this.information = information;
          this._runScript();
          return true;
        } else if(information instanceof Array) {
          this.containerObject.html(
              this.fetchBasicNotificationHTML(
                  'Easy Test provided information is an array, but the script requires the information to be an object or string.',
                  'error'
              )
          );
          return false;
        } else if(typeof information == "string") {
          var objectInstance = this;
          jQuery.getJSON(information, function( response ) {
            objectInstance.information = response;
            objectInstance._runScript();
          });
          return true;
        } else {
          this.containerObject.html(
              this.fetchBasicNotificationHTML(
                  'Easy Test Requires the information to be an object or string.',
                  'error'
              )
          );
          return false;
        }
      },

      _runScript : function() {
        this.internalNamespace += this.information.name.replace(' ', '-');
        jQuery('.' + this.internalNamespace).unbind();

        var objectInstance = this;

        this.containerObject.fadeOut('slow', function(){
          var html = '';

          html += '<div>' +
              '<h2 style="' + objectInstance.fetchInlineCSSByDecorationInformation('title') + '">' + objectInstance.information.name + '</h2>' +
              '<div style="' + objectInstance.fetchInlineCSSByDecorationInformation('description') + '">' +
              objectInstance.information.description +
              '</div>' +
              '<div class="question-container">' +
              objectInstance._fetchScriptQuestionListHTML() +
              '</div>' +
              '</div>';

          objectInstance.containerObject.html(html);
          objectInstance._setQuestionListInteraction();

          jQuery(this).fadeIn('slow');
        });
      },

      _fetchScriptQuestionListHTML : function() {
        var objectInstance = this, html = '', i = 1;

        jQuery.each(this.information.questions, function(key, question){
          html += '<div class="question" style="' + (i > objectInstance.information.question_split ? 'display:none;' : '') + '">' +
                    '<p style="' + objectInstance.fetchInlineCSSByDecorationInformation('question-name') + '">' +
                        '<span style="' + objectInstance.fetchInlineCSSByDecorationInformation('question-name-number') +  '">' +
                          i +
                        '</span> ' +
                        question.name +
                    '</p>';
                  jQuery.each(question.options, function(option, optionScore){
            html += '<div class="option-container" style="' + objectInstance.fetchInlineCSSByDecorationInformation('question-answer-option-container') + '">' +
                      '<label for="' + objectInstance.internalNamespace + '-' + i + '-' + optionScore + '"' +
                             'style="' + objectInstance.fetchInlineCSSByDecorationInformation('question-answer-option-label') + '"' +
                      '>' + option + '</label>' +
                      '<input id="' + objectInstance.internalNamespace + '-' + i + '-' + optionScore + '" ' +
                             'style="' + objectInstance.fetchInlineCSSByDecorationInformation('question-answer-option-radio') + '"' +
                             'type="radio" ' +
                             'name="question_answer[' + i + ']" ' +
                             'value="' + optionScore + '"/>' +
                    '</div>';
                  });
            html += '<div style="' + objectInstance.fetchInlineCSSByDecorationInformation('clear') + '"></div>';
          html += '</div>';

          i++;
        });

        return html;
      },

      _setQuestionListInteraction : function() {
        var objectInstance = this;

        this.containerObject.find('input[type="radio"]').bind('click.' + this.internalNamespace, function(){
          var options = jQuery(this).parents('.question:first').find('.option-container > label');

          options
              .not('[for="' + jQuery(this).attr('id') + '"]')
              .attr('style', objectInstance.fetchInlineCSSByDecorationInformation(
                  [
                    'question-answer-option-label',
                    'question-answer-option-label-not-selected'
                  ]
              ));
          options
              .filter('[for="' + jQuery(this).attr('id') + '"]')
              .attr('style', objectInstance.fetchInlineCSSByDecorationInformation(
                  [
                    'question-answer-option-label',
                    'question-answer-option-label-selected'
                  ]
              ));

          objectInstance._checkQuestionListInteractionOnChange();
        });
      },

      _checkQuestionListInteractionOnChange : function() {
        var questions        = this.containerObject.find('.question-container > .question'),
            visibleQuestions = questions.filter(':visible');

        if(visibleQuestions.length == visibleQuestions.find(':input:checked').length) {
          visibleQuestions.slideUp('slow');


          jQuery('html, body').animate({
            scrollTop: this.containerObject.offset().top
          }, 1000);

          if(visibleQuestions.last().index() + 1 == this.information.questions.length) {
            var userScore = 0;

            questions.find(':input:checked').each(function(){
              userScore += parseFloat(jQuery(this).val());
            });

            this._displayResult(userScore);
          } else {
            questions.slice(
                visibleQuestions.last().index() + 1,
                visibleQuestions.last().index() + this.information.question_split + 1
            ).slideDown('slow');
          }
        }
      },

      _displayResult : function(userScore) {
        var objectInstance = this, html = '', matchingScore = this._fetchMatchingResultScore(userScore);

        if(this.information.display_score)
          html += '<p style="' + this.fetchInlineCSSByDecorationInformation('result-score-container') + '">' +
                      'Scorul tau : ' +
                        '<span style="' + this.fetchInlineCSSByDecorationInformation('result-score-container-score')+ '">' +
                          ( parseFloat(userScore) / parseFloat(objectInstance.information.score_divide)).toFixed(2) +
                        '</span>' +
                  '</p>';

        html += '<div>' +
                  '<ul style="' + objectInstance.fetchInlineCSSByDecorationInformation('result-list') + '">';

          jQuery.each(this.information.result_information, function(resultScore, resultName){
            html += '<li class="result-item" style="display:none;' +
                      (
                        resultScore == matchingScore ?
                            objectInstance.fetchInlineCSSByDecorationInformation(['result-list-item', 'result-list-item-highlight']) :
                            objectInstance.fetchInlineCSSByDecorationInformation('result-list-item')
                      )  +
                      '">' +
                        (resultScore == matchingScore ? ' ~ ' + resultName + ' ~ ' : resultName) +
                        (objectInstance.information.display_score ?
                            ' | ' + parseFloat(parseFloat(resultScore) / parseFloat(objectInstance.information.score_divide)).toFixed(2) :
                            '') +
                      '</li>'
          });

        html +=   '</ul>' +
                '<div>';

        this.containerObject.find('.question-container').after(html);

        this.containerObject.find('.result-item').each(function(){
          jQuery(this).delay(jQuery(this).index() * 400).fadeIn('slow');
        });

        jQuery('.' + this.internalNamespace).unbind();
      },

      _fetchMatchingResultScore : function(scoreCheck) {
        var matchingScore = 0;

        jQuery.each(this.information.result_information, function(resultScore, resultName){
          if(resultScore >= matchingScore && scoreCheck >= resultScore)
            matchingScore = resultScore;
        });

        return matchingScore;
      },

      fetchBasicNotificationHTML : function(message, type) {
        return '<div style="' + this.fetchInlineCSSByDecorationInformation(['notification', 'notification-' + type]) + '">' +
                  message +
               '</div>';
      },

      fetchInlineCSSByDecorationInformation : function(information) {
        if(typeof information == "string") {
          return this._fetchInlineCSSByDecorationInformationUsingString(information);
        } else {
          var informationUsed = {}, objectInstance = this;

          jQuery.each(information, function(index, informationObject) {
            informationUsed = jQuery.extend(true, informationUsed, objectInstance.decorationInformation[informationObject]);
          });

          return this._fetchInlineCSSByDecorationInformationUsingStringObject(informationUsed);
        }
      },

      _fetchInlineCSSByDecorationInformationUsingString : function(information_string) {
        if(typeof this.decorationInformation[information_string] == "undefined")
          return '';

        return this._fetchInlineCSSByDecorationInformationUsingStringObject(this.decorationInformation[information_string]);
      },

      _fetchInlineCSSByDecorationInformationUsingStringObject : function(information_object) {
        var composedStyle = '';

        jQuery.each(information_object, function(cssDecorator, cssDecoratorValue){
          composedStyle += cssDecorator + ' : ' + cssDecoratorValue + '; ';
        });

        return composedStyle;
      }
  };
}

jQuery(document).ready(function(){
  jQuery('.easy-test').each(function(){
    if(jQuery(this).hasClass('handled'))
      return;

    jQuery(this).addClass('handled');

    var currentTest = jQuery.extend(true, {}, EasyTest);

    currentTest.init(jQuery(this), jQuery(this).attr('data-script-information'));
  });
});