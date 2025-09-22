#!/usr/bin/env python3
"""
Create a very simple VistaAI logo using basic PIL operations
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_simple_logo(size=128):
    """Create a very simple logo that Chrome will definitely accept"""
    # Create a solid blue background - make it brighter for toolbar visibility
    img = Image.new('RGB', (size, size), (33, 150, 243))  # Brighter blue
    draw = ImageDraw.Draw(img)
    
    # Draw a white circle in the center with a blue border
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], 
                fill=(255, 255, 255), outline=(33, 150, 243), width=3)
    
    # Draw a simple "V" using lines - make it blue and thicker
    center = size // 2
    v_size = size // 3
    
    # Left side of V
    left_x = center - v_size // 2
    right_x = center + v_size // 2
    top_y = center - v_size // 2
    bottom_y = center + v_size // 2
    
    # Draw V shape with thick lines
    line_width = max(3, size // 12)  # Thicker lines
    
    # Left diagonal
    draw.line([(left_x, top_y), (center, bottom_y)], 
             fill=(33, 150, 243), width=line_width)
    
    # Right diagonal  
    draw.line([(center, bottom_y), (right_x, top_y)], 
             fill=(33, 150, 243), width=line_width)
    
    # Add a subtle border around the entire logo for better visibility
    draw.rectangle([0, 0, size-1, size-1], outline=(255, 255, 255), width=1)
    
    return img

def create_all_logos():
    """Create all required logo sizes"""
    sizes = [16, 48, 128]
    
    for size in sizes:
        logo = create_simple_logo(size)
        filename = f"vista-ai-logo-{size}.png"
        logo.save(filename, 'PNG')
        print(f"✅ Created {filename}")
    
    # Also create the main logo
    logo = create_simple_logo(128)
    logo.save("vista-ai-logo.png", 'PNG')
    print(f"✅ Created vista-ai-logo.png")

if __name__ == "__main__":
    create_all_logos()
    print("✅ All VistaAI logos created successfully!")
