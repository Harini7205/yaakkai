from flask import Blueprint, request, jsonify
import xml.etree.ElementTree as ET
import requests
import random
import os

# Create a Blueprint for resource-related routes
resources_bp = Blueprint("resources", __name__)

# Replace with your YouTube API Key
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
search_queries=['cardiovascular disease prevention','cardiovascular disease','cardiovascular disease risk factors','cardiovascular disease treatment','cardiovascular disease management','how lifestyle factors influence cvd']

# Fetch YouTube videos
@resources_bp.route("/youtube-resources", methods=["GET"])
def get_youtube_resources():
    search_query = search_queries[random.randint(0, len(search_queries)-1)]  # Randomly select a search query
    print(search_query)
    youtube_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={search_query}&type=video&maxResults=5"
    
    try:
        response = requests.get(youtube_url)
        data = response.json()
        
        videos = [
            {
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            }
            for item in data.get("items", [])
        ]
        print(videos)
        return jsonify({"resources": videos})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@resources_bp.route("/medlineplus-resources", methods=["GET"])
def get_medlineplus_resources():
    term = "cardiovascular disease"  # Default search term
    retmax = 5  # Limit results (default: 10)
    
    medline_url = f"https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term={term}&retmax={retmax}"

    try:
        response = requests.get(medline_url)
        response.raise_for_status()  # Ensure we handle HTTP errors
        
        root = ET.fromstring(response.content)  # Parse XML response
        articles = []

        for document in root.findall(".//document"):
            title_element = document.find("content[@name='title']")
            url = document.get("url")  # URL is an attribute, not a content element
            print(title_element, url)

            if title_element is not None and url:
                articles.append({
                    "title": title_element.text,
                    "url": url
                })

        return jsonify({
            "query_term": term,
            "count": len(articles),
            "resources": articles
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Request error: {str(e)}"}), 500
    except ET.ParseError as e:
        return jsonify({"error": f"XML parsing error: {str(e)}"}), 500

