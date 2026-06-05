import requests
import os

images = {
    "banner.jpg": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200",
    "ai.jpg": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1000",
    "robotics.jpg": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000",
    "software-engineering.jpg": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1000",
    "medicine.jpg": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000",
    "cybersecurity.jpg": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000",
    "data-science.jpg": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000",
    "entrepreneurship.jpg": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000",
}

os.makedirs("careerconnect-images", exist_ok=True)

for filename, url in images.items():
    r = requests.get(url, stream=True)
    with open(os.path.join("careerconnect-images", filename), "wb") as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)

print("Downloaded successfully.")