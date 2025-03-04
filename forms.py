from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectMultipleField, SubmitField
from wtforms.validators import DataRequired, URL

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log In')

class LectureForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    youtube_url = StringField('YouTube URL', validators=[DataRequired(), URL()])
    topics = SelectMultipleField('Topics', coerce=int)
    tags = SelectMultipleField('Tags', coerce=int)
    rank = SelectMultipleField('Rank', coerce=int)
    submit = SubmitField('Save Lecture')

class MetadataForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    submit = SubmitField('Save')
