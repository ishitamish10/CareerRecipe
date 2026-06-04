from flask import Flask, render_template, request, jsonify, session
from datetime import datetime
import json
import os
from functools import wraps

app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'

# Store roadmaps in a JSON file (in production, use a database)
ROADMAPS_FILE = 'roadmaps.json'

def load_roadmaps():
    """Load roadmaps from JSON file"""
    if os.path.exists(ROADMAPS_FILE):
        with open(ROADMAPS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_roadmaps(roadmaps):
    """Save roadmaps to JSON file"""
    with open(ROADMAPS_FILE, 'w') as f:
        json.dump(roadmaps, f, indent=2)

@app.route('/')
def index():
    """Home page"""
    roadmaps = load_roadmaps()
    total_roadmaps = len(roadmaps)
    total_discussions = sum(len(r.get('discussions', [])) for r in roadmaps)
    trending = sorted(roadmaps, key=lambda x: x.get('views', 0), reverse=True)[:3]
    
    return render_template('index.html', 
                         total_roadmaps=total_roadmaps,
                         total_discussions=total_discussions,
                         trending=trending)

@app.route('/create', methods=['GET', 'POST'])
def create():
    """Create a new career roadmap"""
    if request.method == 'POST':
        data = request.json
        
        new_roadmap = {
            'id': len(load_roadmaps()) + 1,
            'title': data.get('title'),
            'career_path': data.get('career_path'),
            'duration_years': data.get('duration_years'),
            'achievements': data.get('achievements', []),
            'challenges': data.get('challenges', []),
            'lessons': data.get('lessons', []),
            'tips': data.get('tips', []),
            'created_at': datetime.now().isoformat(),
            'views': 0,
            'likes': 0,
            'discussions': []
        }
        
        roadmaps = load_roadmaps()
        roadmaps.append(new_roadmap)
        save_roadmaps(roadmaps)
        
        return jsonify({'success': True, 'id': new_roadmap['id']})
    
    return render_template('create.html')

@app.route('/roadmap/<int:roadmap_id>')
def roadmap(roadmap_id):
    """View a specific roadmap"""
    roadmaps = load_roadmaps()
    roadmap = next((r for r in roadmaps if r['id'] == roadmap_id), None)
    
    if not roadmap:
        return "Roadmap not found", 404
    
    # Increment view count
    roadmap['views'] = roadmap.get('views', 0) + 1
    save_roadmaps(roadmaps)
    
    return render_template('roadmap.html', roadmap=roadmap)

@app.route('/api/roadmaps')
def api_roadmaps():
    """Get all roadmaps"""
    roadmaps = load_roadmaps()
    return jsonify(roadmaps)

@app.route('/api/roadmap/<int:roadmap_id>/like', methods=['POST'])
def like_roadmap(roadmap_id):
    """Like a roadmap"""
    roadmaps = load_roadmaps()
    roadmap = next((r for r in roadmaps if r['id'] == roadmap_id), None)
    
    if roadmap:
        roadmap['likes'] = roadmap.get('likes', 0) + 1
        save_roadmaps(roadmaps)
        return jsonify({'success': True, 'likes': roadmap['likes']})
    
    return jsonify({'success': False}), 404

@app.route('/api/roadmap/<int:roadmap_id>/discuss', methods=['POST'])
def add_discussion(roadmap_id):
    """Add a discussion comment"""
    data = request.json
    roadmaps = load_roadmaps()
    roadmap = next((r for r in roadmaps if r['id'] == roadmap_id), None)
    
    if roadmap:
        discussion = {
            'id': len(roadmap.get('discussions', [])) + 1,
            'author': 'Anonymous User',
            'comment': data.get('comment'),
            'timestamp': datetime.now().isoformat(),
            'helpful': 0
        }
        
        if 'discussions' not in roadmap:
            roadmap['discussions'] = []
        
        roadmap['discussions'].append(discussion)
        save_roadmaps(roadmaps)
        
        return jsonify({'success': True, 'discussion': discussion})
    
    return jsonify({'success': False}), 404

@app.route('/trending')
def trending():
    """Trending roadmaps page"""
    roadmaps = load_roadmaps()
    sorted_roadmaps = sorted(roadmaps, key=lambda x: x.get('views', 0), reverse=True)
    
    return render_template('trending.html', roadmaps=sorted_roadmaps)

@app.route('/community')
def community():
    """Community discussions page"""
    roadmaps = load_roadmaps()
    all_discussions = []
    
    for roadmap in roadmaps:
        for discussion in roadmap.get('discussions', []):
            all_discussions.append({
                'roadmap_title': roadmap['title'],
                'roadmap_id': roadmap['id'],
                'discussion': discussion
            })
    
    all_discussions = sorted(all_discussions, 
                            key=lambda x: x['discussion']['timestamp'], 
                            reverse=True)
    
    return render_template('community.html', discussions=all_discussions)

@app.route('/mentors')
def mentors():
    """Mentors and resources page"""
    return render_template('mentors.html')

@app.route('/login')
def login():
    """Login page (placeholder)"""
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
