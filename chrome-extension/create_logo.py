#!/usr/bin/env python3
"""
Create a simple VistaAI logo for Chrome extension
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_vista_logo(output_path, size=128):
    """Create a simple VistaAI logo with 'VA' text"""
    # Create a blue background image
    img = Image.new('RGBA', (size, size), (66, 133, 244, 255))  # Google Blue
    draw = ImageDraw.Draw(img)
    
    # Try to use a common font, fallback if not found
    try:
        # Try different font sizes
        font_size = int(size * 0.6)
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except (IOError, OSError):
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttf", font_size)
        except (IOError, OSError):
            font = ImageFont.load_default()
            print("Warning: Using default font")
    
    text = "VA"
    
    # Calculate text position to center it
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - 5  # Adjust slightly for visual centering
    
    # Draw white text "VA"
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Add a subtle border
    draw.rectangle([0, 0, size-1, size-1], outline=(255, 255, 255, 100), width=2)
    
    img.save(output_path, 'PNG')
    print(f"✅ Logo created at {output_path}")

def create_all_sizes():
    """Create logos in all required sizes"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        filename = f"vista-ai-logo-{size}.png"
        create_vista_logo(filename, size)
    
    # Also create the main logo file
    create_vista_logo("vista-ai-logo.png", 128)
    print("✅ All VistaAI logos created successfully!")

if __name__ == "__main__":
    create_all_sizes()
