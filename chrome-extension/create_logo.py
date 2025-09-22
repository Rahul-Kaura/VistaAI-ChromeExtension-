#!/usr/bin/env python3
"""
Create a sophisticated VistaAI logo inspired by OpenAI but unique
"""
from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_vista_logo(output_path, size=128):
    """Create a simple, reliable VistaAI logo that works in Chrome extensions"""
    # Create a solid background - use RGB instead of RGBA for better compatibility
    img = Image.new('RGB', (size, size), (66, 133, 244))  # Google Blue background
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = int(size * 0.35)
    
    # Draw a simple circle with gradient effect
    for i in range(radius, 0, -2):
        # Create gradient from outer to inner
        ratio = i / radius
        r = int(66 + (255 - 66) * (1 - ratio))
        g = int(133 + (255 - 133) * (1 - ratio))
        b = int(244 + (255 - 244) * (1 - ratio))
        draw.ellipse([center-i, center-i, center+i, center+i], 
                    fill=(r, g, b), outline=None)
    
    # Add a white border
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                fill=None, outline=(255, 255, 255), width=3)
    
    # Add central "V" for Vista
    try:
        font_size = int(size * 0.5)
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except (IOError, OSError):
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttf", font_size)
        except (IOError, OSError):
            font = ImageFont.load_default()
    
    text = "V"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = center - text_width // 2
    y = center - text_height // 2 - 2
    
    # Draw white "V" with shadow for better visibility
    draw.text((x+2, y+2), text, fill=(0, 0, 0), font=font)  # Shadow
    draw.text((x, y), text, fill=(255, 255, 255), font=font)  # Main text
    
    # Add small dots around the circle for AI theme
    dot_radius = max(2, int(size * 0.04))
    for i in range(8):
        angle = math.pi * i / 4
        dot_x = center + (radius + 8) * math.cos(angle)
        dot_y = center + (radius + 8) * math.sin(angle)
        draw.ellipse([dot_x-dot_radius, dot_y-dot_radius, dot_x+dot_radius, dot_y+dot_radius], 
                    fill=(255, 255, 255))
    
    # Save as PNG with RGB mode
    img.save(output_path, 'PNG')
    print(f"✅ VistaAI logo created at {output_path}")

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
