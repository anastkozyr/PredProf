from flask import Flask, render_template, send_from_directory, redirect, request, jsonify, \
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
    user_level = current_user.level
    return render_template('practic.html', user_level=user_level)


@app.route('/smartphone_basics', methods=['POST'])
@login_required
def smartphone_basics():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_advanced = "1" + user.progress_advanced[1:]
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/smartphone_basics', methods=['GET'])
@login_required
def smartphone_basics_page():
    user_level = current_user.level
    return render_template('smartphone_basics.html', user_level=user_level)


@app.route('/smartphone_basics_base', methods=['POST'])
@login_required
def smartphone_basics_base():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_basic = "1" + user.progress_basic[1:]
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/smartphone_basics_base', methods=['GET'])
@login_required
def smartphone_basics_base_page():
    return render_template('smartphone_basics_base.html')


@app.route('/messenger_training', methods=['POST'])
@login_required
def messenger_training():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    if user.level == 'basic':
        user.progress_basic = user.progress_basic[0] + "1" + user.progress_basic[2:]
    else:
        user.progress_advanced = user.progress_advanced[0] + "1" + user.progress_advanced[2:]
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/messenger_training', methods=['GET'])
@login_required
def messenger_training_page():
    user_level = current_user.level
    print(user_level)
    if user_level == 'basic':
        return render_template('messenger_training_basic.html')
    else:
        return render_template('messanger_training_advanced.html')

@app.route('/public_services', methods=['POST'])
@login_required
def gosuslugi_training():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_basic = user.progress_basic[:2] + "1" + user.progress_basic[3]
    db_sess.commit()
    return jsonify({"status": "ok"})

@app.route('/public_services', methods=['GET'])
@login_required
def gosuslugi_training_page():
    return render_template('public_services.html')

@app.route('/public_services_pro', methods=['POST'])
@login_required
def gosuslugi_training_pro():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_advanced = user.progress_advanced[:2] + "1" + user.progress_advanced[3]
    db_sess.commit()
    return jsonify({"status": "ok"})

@app.route('/public_services_pro', methods=['GET'])
@login_required
def gosuslugi_training_pro_page():
    return render_template('public_services_pro.html')


@app.route('/teory_smartphone-services')
@login_required
def teory_smartphone():
    return render_template('teory_smartphone.html')


@app.route('/online_shopping_basic', methods=['POST'])
@login_required
def online_shopping_basic():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_basic = user.progress_basic[:3] + "1"
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/online_shopping_basic', methods=['GET'])
@login_required
def online_shopping_basic_page():
    return render_template('online_shopping_basic.html')


@app.route('/online_shopping', methods=['POST'])
@login_required
def online_shopping():
    db_sess = db_session.create_session()
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.progress_advanced = user.progress_advanced[:3] + "1"
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/online_shopping', methods=['GET'])
@login_required
def online_shopping_page():
    return render_template('online_shopping_pro.html')


@app.route('/buttons')
@login_required
def buttons():
    user_level = current_user.level
    return render_template('buttons.html', user_level=user_level)


@app.route('/change_level', methods=['POST'])
@login_required
def change_level():
    db_sess = db_session.create_session()
    data = request.get_json()
    level = data.get('level')
    user = db_sess.query(User).filter(User.id == current_user.id).first()
    user.level = level
    db_sess.commit()
    return jsonify({"status": "ok"})


@app.route('/account')
@login_required
def account():
    name = current_user.name
    level = current_user.level
    created_date = current_user.created_date
    formatted_date = created_date.strftime('%d.%m.%Y')
    medals = current_user.progress_basic.count('1') + current_user.progress_advanced.count('1')
    basic = current_user.progress_basic
    advanced = current_user.progress_advanced
    if level == 'basic':
        first = int(current_user.progress_basic[0])
        second = int(current_user.progress_basic[1])
        third = int(current_user.progress_basic[2])
        fourth = int(current_user.progress_basic[3])
        levelrus = "Базовый"
    else:
        first = int(current_user.progress_advanced[0])
        second = int(current_user.progress_advanced[1])
        third = int(current_user.progress_advanced[2])
        fourth = int(current_user.progress_advanced[3])
        levelrus = "Продвинутый"
    progress = str(round((basic.count('1') + advanced.count('1')) * 12.5)) + '%'
    tasks = int(basic[0]) * 2 + int(basic[1]) * 3 + int(basic[2]) * 2 + int(basic[3]) * 4 + int(advanced[0]) * 4 + int(advanced[1]) * 4 + int(advanced[2]) * 3 + int(advanced[3]) * 7
    return render_template('account.html',
                           name=name, level=level, levelrus=levelrus, first=first, second=second, third=third,
                           fourth=fourth,
                           created_date=formatted_date, progress=progress, medals=medals, basic=basic,
                           advanced=advanced, tasks=tasks)
