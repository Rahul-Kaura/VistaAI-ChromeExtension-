#!/usr/bin/env python3
"""
Create a very simple VistaAI logo using basic PIL operations
"""
from PIL import Image, ImageDraw, ImageFont
import os

def create_simple_logo(size=128):
    """Create a very simple logo that Chrome will definitely accept"""
    # Create a solid blue background
    img = Image.new('RGB', (size, size), (66, 133, 244))  # Google Blue
    draw = ImageDraw.Draw(img)
    
    # Draw a white circle in the center
    margin = size // 8
    draw.ellipse([margin, margin, size-margin, size-margin], 
                fill=(255, 255, 255), outline=(0, 0, 0), width=2)
    
    # Draw a simple "V" using lines
    center = size // 2
    v_size = size // 3
    
    # Left side of V
    left_x = center - v_size // 2
    right_x = center + v_size // 2
    top_y = center - v_size // 2
    bottom_y = center + v_size // 2
    mid_y = center
    
    # Draw V shape with thick lines
    line_width = max(2, size // 16)
    
    # Left diagonal
    draw.line([(left_x, top_y), (center, bottom_y)], 
             fill=(66, 133, 244), width=line_width)
    
    # Right diagonal  
    draw.line([(center, bottom_y), (right_x, top_y)], 
             fill=(66, 133, 244), width=line_width)
    
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
