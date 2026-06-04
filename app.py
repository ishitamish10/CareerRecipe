from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# ============ DATABASE CONFIGURATION ============
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///careerrecipe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_change_this'

db = SQLAlchemy(app)

# ============ DATABASE MODELS ============

class User(db.Model):
    """User model for storing user information"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    roadmaps = db.relationship('Roadmap', backref='author', lazy=True, cascade='all, delete-orphan')
    helpful_votes = db.relationship('HelpfulVote', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.username}>'


class Roadmap(db.Model):
    """Roadmap model for storing career journeys"""
    __tablename__ = 'roadmaps'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False, index=True)
    field = db.Column(db.String(120), nullable=False, index=True)
    duration = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=False)
    successes = db.Column(db.Text, nullable=False)
    challenges = db.Column(db.Text, nullable=False)
    lessons = db.Column(db.Text, nullable=False)
    tips = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Relationships
    helpful_votes = db.relationship('HelpfulVote', backref='roadmap', lazy=True, cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='roadmap', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'field': self.field,
            'duration': self.duration,
            'description': self.description,
            'successes': self.successes,
            'challenges': self.challenges,
            'lessons': self.lessons,
            'tips': self.tips,
            'created_at': self.created_at.isoformat(),
            'helpful': len(self.helpful_votes),
            'comments_count': len(self.comments)
        }
    
    def __repr__(self):
        return f'<Roadmap {self.title}>'


class HelpfulVote(db.Model):
    """Model for tracking helpful votes on roadmaps"""
    __tablename__ = 'helpful_votes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    roadmap_id = db.Column(db.Integer, db.ForeignKey('roadmaps.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'roadmap_id', name='unique_vote'),)
    
    def __repr__(self):
        return f'<HelpfulVote user={self.user_id} roadmap={self.roadmap_id}>'


class Comment(db.Model):
    """Model for comments on roadmaps"""
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    roadmap_id = db.Column(db.Integer, db.ForeignKey('roadmaps.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Comment {self.id}>'


# ============ ROUTES ============

@app.route('/')
def index():
    """Home page"""
    roadmap_count = Roadmap.query.count()
    return render_template('index.html', count=roadmap_count)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login route"""
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        
        if user and user.check_password(data.get('password')):
            session['user_id'] = user.id
            session['username'] = user.username
            return jsonify({'success': True})
        
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    
    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Sign up route"""
    if request.method == 'POST':
        data = request.get_json()
        
        # Check if user exists
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'success': False, 'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data.get('username'),
            email=data.get('email')
        )
        user.set_password(data.get('password'))
        
        db.session.add(user)
        db.session.commit()
        
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({'success': True})
    
    return render_template('signup.html')


@app.route('/logout')
def logout():
    """Logout route"""
    session.clear()
    return redirect('/')


@app.route('/create', methods=['GET', 'POST'])
def create():
    """Create a new roadmap"""
    if request.method == 'POST':
        data = request.get_json()
        
        roadmap = Roadmap(
            title=data.get('title'),
            field=data.get('field'),
            duration=data.get('duration'),
            description=data.get('description'),
            successes=data.get('successes'),
            challenges=data.get('challenges'),
            lessons=data.get('lessons'),
            tips=data.get('tips'),
            user_id=session.get('user_id')
        )
        
        db.session.add(roadmap)
        db.session.commit()
        
        return jsonify({'success': True, 'id': roadmap.id})
    
    return render_template('create.html')


@app.route('/roadmap/<int:roadmap_id>')
def roadmap(roadmap_id):
    """View a specific roadmap"""
    roadmap_data = Roadmap.query.get_or_404(roadmap_id)
    return render_template('roadmap.html', roadmap=roadmap_data)


@app.route('/api/roadmaps')
def get_roadmaps():
    """Get all roadmaps"""
    roadmaps = Roadmap.query.order_by(Roadmap.created_at.desc()).all()
    return jsonify([r.to_dict() for r in roadmaps])


@app.route('/api/search')
def search_roadmaps():
    """Search roadmaps by field"""
    query = request.args.get('q', '').lower()
    roadmaps = Roadmap.query.filter(
        (Roadmap.field.ilike(f'%{query}%')) | 
        (Roadmap.title.ilike(f'%{query}%'))
    ).all()
    return jsonify([r.to_dict() for r in roadmaps])


@app.route('/api/roadmaps/<int:roadmap_id>/helpful', methods=['POST'])
def mark_helpful(roadmap_id):
    """Mark a roadmap as helpful"""
    roadmap = Roadmap.query.get_or_404(roadmap_id)
    user_id = session.get('user_id')
    
    # Check if user already voted
    existing_vote = HelpfulVote.query.filter_by(
        user_id=user_id,
        roadmap_id=roadmap_id
    ).first()
    
    if existing_vote:
        return jsonify({'error': 'Already voted'}), 400
    
    vote = HelpfulVote(user_id=user_id, roadmap_id=roadmap_id)
    db.session.add(vote)
    db.session.commit()
    
    return jsonify({'helpful': len(roadmap.helpful_votes)})


@app.route('/community')
def community():
    """Community page"""
    return render_template('community.html')


@app.route('/trending')
def trending():
    """Trending roadmaps page"""
    roadmaps = Roadmap.query.outerjoin(HelpfulVote).group_by(Roadmap.id).order_by(
        db.func.count(HelpfulVote.id).desc()
    ).limit(10).all()
    return render_template('trending.html', roadmaps=roadmaps)


# ============ CREATE DATABASE ============

def init_db():
    """Initialize database"""
    with app.app_context():
        db.create_all()
        print("✅ Database created successfully!")


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
