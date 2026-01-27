from flask_wtf import FlaskForm
from werkzeug.security import generate_password_hash, check_password_hash
from wtforms import PasswordField, StringField, TextAreaField, SubmitField, EmailField, BooleanField, SelectField, \
    RadioField
from wtforms.validators import DataRequired


class RegisterForm(FlaskForm):
    name = StringField('Имя пользователя', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    # level = SelectField('Выберите уровень', choices=[
    #     ('basic', 'Базовый'), ('advanced', 'Расширенный')
    # ], validators=[DataRequired()])
    level = RadioField('Уровень обучения', choices=[('basic', 'Базовый'), ('advanced', 'Расширенный')],
                       validators=[DataRequired(message="Выберите уровень обучения")],
                       default='basic')

    submit = SubmitField('Зарегистрироваться')  # Изменили текст

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

class LoginForm(FlaskForm):
    name = StringField('Имя пользователя', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    submit = SubmitField('Войти')