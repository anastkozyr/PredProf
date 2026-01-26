from flask import Flask, render_template, redirect, request  # ← добавили request!
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from data import db_session
from data.users import User
from forms.user import RegisterForm, LoginForm

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vunned111vunned111'


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    return db_sess.query(User).get(user_id)


db_session.global_init("db/users.db")

@app.route('/')
def start_page():
    return render_template('base.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():

        db_sess = db_session.create_session()


        if db_sess.query(User).filter(User.name == form.name.data).first():
            return render_template('register.html',
                                 form=form,
                                 message="Пользователь с таким именем уже существует")

        user = User(
            name=form.name.data,
            # email больше не обязателен
            about=form.level.data # Поле level
        )
        user.set_password(form.password.data)

        db_sess.add(user)
        db_sess.commit()
        return redirect('/login')

    return render_template('register.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        # Ищем пользователя по имени, а не по email
        user = db_sess.query(User).filter(User.name == form.name.data).first()

        if user and user.check_password(form.password.data):
            login_user(user, remember=True)  # remember_me убрали
            return redirect(request.referrer or "/go-to-trainer")  # Перенаправляем в тренажер

        return render_template('login.html',
                             form=form,
                             message="Неправильное имя пользователя или пароль")

    return render_template('login.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")

@app.route('/go-to-trainer')
def go_to_trainer():
    return render_template('practic.html')

@app.route('/smartphone_basics')
def smartphone_basics():
    return render_template('smartphone_basics.html')

@app.route('/messenger_training')
def messenger_training():
    return render_template('messenger_training.html')

@app.route('/public-services')
def gosuslugi_training():
    return render_template('public_services.html')

@app.route('/online_shopping')
def online_shopping():
    return render_template('online_shopping.html')

@app.route('/buttons')
def buttons():
    return render_template('buttons.html')

if __name__ == '__main__':
    app.run(debug=True, port=8028, host='127.0.0.1')