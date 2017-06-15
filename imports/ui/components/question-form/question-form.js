import React from 'react';
import { Question } from '/imports/api/quizes/quizes.js';
import AnswerForm from '../answer-form/answer-form.js';

// validations
const validateText = (text) => {
  let message;
  const question = new Question({ text });
  question.validate(
    {
      fields: ['text'],
    },
    err => (message = err && err.reason),
  );
  return message;
};

const validateTime = (time) => {
  let message;
  const question = new Question({ time });
  question.validate(
    {
      fields: ['time'],
      cast: true,
    },
    err => (message = err && err.reason),
  );
  return message;
};

const QuestionForm = ({ question, validate, actions }) => {
  const textValidation = validate && validateText(question.text);
  const timeValidation = validate && validateTime(question.time);
  const answerActions = {
    changeText: actions.changeAnswerText(question._id),
    changePoints: actions.changeAnswerPoints(question._id),
  };
  return (
    <div className="form-horizontal">
      <div className="panel panel-default">
        <div className="panel-heading">
          <div className="form-group">
            <div className="col-lg-8">
              <div className={`form-group ${textValidation ? 'has-error' : ''}`}>
                <input
                  name="text"
                  value={question.text}
                  className="form-control input-lg"
                  placeholder="שאל/י שאלה"
                  onChange={actions.changeQuestionText(question._id)}
                />
                {textValidation
                  ? <label className="control-label" htmlFor="text">{textValidation}</label>
                  : ''}
              </div>
            </div>
            <div className="col-lg-3">
              <div className={`form-group ${timeValidation ? 'has-error' : ''}`}>
                <label htmlFor="time" className="control-label col-lg-6">זמן לשאלה:</label>
                <input
                  className="form-control input-lg col-lg-6"
                  value={question.time}
                  onChange={actions.changeQuestionTime(question._id)}
                />
                {timeValidation
                  ? <label className="control-label" htmlFor="time">{timeValidation}</label>
                  : ''}
              </div>
            </div>
            <div className="col-lg-1">
              <button
                className="btn btn-danger btn-lg"
                onClick={actions.removeQuestion(question._id)}
              >
                <span className="glyphicon glyphicon-minus" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="panel-body">
          {question.answers.map((a, i) => (
            <AnswerForm
              key={a._id}
              answer={a}
              index={i + 1}
              validate={validate}
              actions={answerActions}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionForm;
