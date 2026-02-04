from flask import Flask, render_template, send_from_directory, redirect, request, flash, session, \
    url_for  # ← добавили request!
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from data import db_session
from data.users import User
from forms.user import RegisterForm, LoginForm

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vunned111vunned111'

db_session.global_init("db/users.db")

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    db_sess = db_session.create_session()
    try:
        return db_sess.query(User).get(int(user_id))
    finally:
        db_sess.close()


@app.route('/')
def start_page():
    return render_template('base.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():

        db_sess = db_session.create_session()
        try:
            if db_sess.query(User).filter(User.name == form.name.data).first():
                return render_template('register.html',
                                       form=form,
                                       message="Пользователь с таким именем уже существует")

            user = User(
                name=form.name.data,
                # email больше не обязателен
                level=form.level.data  # Поле level
            )
            user.set_password(form.password.data)

            db_sess.add(user)
            db_sess.commit()
            return redirect('/login')
        finally:
            db_sess.close()

    return render_template('register.html', form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        db_sess = db_session.create_session()
        # Ищем пользователя по имени, а не по email
        try:
            user = db_sess.query(User).filter(User.name == form.name.data).first()

            if user and user.check_password(form.password.data):
                login_user(user, remember=True)  # remember_me убрали
                return redirect("/go-to-trainer")  # Перенаправляем в тренажер

            return render_template('login.html',
                                   message="Неправильное имя пользователя или пароль",
                                   form=form)
        finally:
            db_sess.close()

    return render_template('login.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


@app.route('/images/<path:filename>')
def images_files(filename):
    return send_from_directory('images', filename)


@app.route('/go-to-trainer')
@login_required
def go_to_trainer():
    return render_template('practic.html')


@app.route('/smartphone_basics')
@login_required
def smartphone_basics():
    user_level = current_user.level
    return render_template('smartphone_basics.html', user_level=user_level)


@app.route('/smartphone_basics_base')
@login_required
def smartphone_basics_base():
    user_level = current_user.level
    return render_template('smartphone_basics_base.html', user_level=user_level)


@app.route('/messenger_training')
@login_required
def messenger_training():
    return render_template('messenger_training.html')


@app.route('/public-services')
@login_required
def gosuslugi_training():
    return render_template('public_services.html')


@app.route('/teory_smartphone-services')
@login_required
def teory_smartphone():
    return render_template('teory_smartphone.html')


@app.route('/online_shopping')
@login_required
def online_shopping():
    return render_template('online_shopping_pro.html')


@app.route('/buttons')
@login_required
def buttons():
    user_level = current_user.level
    return render_template('buttons.html', user_level=user_level)


@app.route('/account')
@login_required
def account():
    return render_template('account.html')




if __name__ == '__main__':
    app.run(debug=True, port=8028, host='127.0.0.1')
