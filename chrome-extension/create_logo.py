#!/usr/bin/env python3
"""
Create a sophisticated VistaAI logo inspired by OpenAI but unique
"""
from PIL import Image, ImageDraw, ImageFont
import os
import math

def create_vista_logo(output_path, size=128):
    """Create a sophisticated VistaAI logo with AI-inspired design"""
    # Create a solid background - use RGB for better compatibility
    img = Image.new('RGB', (size, size), (20, 30, 50))  # Dark blue background
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    radius = int(size * 0.4)
    
    # Create gradient-like effect with multiple circles
    for i in range(5):
        alpha = 255 - (i * 40)
        r = radius - (i * 8)
        if r > 0:
            # Outer ring - dark teal
            draw.ellipse([center-r, center-r, center+r, center+r], 
                        fill=(0, 100, 120), outline=None)
    
    # Main circle - gradient from teal to blue
    for i in range(radius, 0, -2):
        # Gradient from teal to blue
        ratio = i / radius
        r = int(20 + (66 - 20) * (1 - ratio))
        g = int(100 + (133 - 100) * (1 - ratio))
        b = int(120 + (244 - 120) * (1 - ratio))
        draw.ellipse([center-i, center-i, center+i, center+i], 
                    fill=(r, g, b), outline=None)
    
    # Inner AI-inspired geometric pattern
    inner_radius = int(radius * 0.6)
    
    # Draw hexagon (AI/tech theme)
    hex_points = []
    for i in range(6):
        angle = math.pi * i / 3
        x = center + inner_radius * math.cos(angle)
        y = center + inner_radius * math.sin(angle)
        hex_points.append((x, y))
    
    # Fill hexagon with gradient
    for i in range(inner_radius, 0, -3):
        ratio = i / inner_radius
        r = int(100 + (255 - 100) * (1 - ratio))
        g = int(150 + (255 - 150) * (1 - ratio))
        b = int(255)
        draw.ellipse([center-i, center-i, center+i, center+i], 
                    fill=(r, g, b), outline=None)
    
    # Draw hexagon outline
    draw.polygon(hex_points, fill=None, outline=(255, 255, 255), width=2)
    
    # Add central "V" for Vista - make it much larger and more visible
    try:
        font_size = int(size * 0.6)  # Increased from 0.4 to 0.6
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
        
        text = "V"
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        x = center - text_width // 2
        y = center - text_height // 2 - 2
        
        # Draw white "V" with bold shadow for better visibility
        draw.text((x+2, y+2), text, fill=(0, 0, 0), font=font)  # Bold shadow
        draw.text((x+1, y+1), text, fill=(0, 0, 0), font=font)  # Additional shadow
        draw.text((x, y), text, fill=(255, 255, 255), font=font)  # Main text
        
    except (IOError, OSError):
        # Fallback: Draw "V" manually with lines
        v_width = int(size * 0.3)
        v_height = int(size * 0.4)
        v_x = center - v_width // 2
        v_y = center - v_height // 2
        
        # Draw "V" shape with thick white lines
        line_width = max(3, int(size * 0.05))
        
        # Left side of V
        draw.line([(v_x, v_y), (v_x + v_width//4, v_y + v_height)], 
                 fill=(0, 0, 0), width=line_width+2)  # Shadow
        draw.line([(v_x, v_y), (v_x + v_width//4, v_y + v_height)], 
                 fill=(255, 255, 255), width=line_width)  # Main line
        
        # Right side of V
        draw.line([(v_x + v_width*3//4, v_y + v_height), (v_x + v_width, v_y)], 
                 fill=(0, 0, 0), width=line_width+2)  # Shadow
        draw.line([(v_x + v_width*3//4, v_y + v_height), (v_x + v_width, v_y)], 
                 fill=(255, 255, 255), width=line_width)  # Main line
    
    # Add small AI dots around the hexagon
    dot_radius = int(size * 0.03)
    for i in range(6):
        angle = math.pi * i / 3
        dot_x = center + (inner_radius + 15) * math.cos(angle)
        dot_y = center + (inner_radius + 15) * math.sin(angle)
        draw.ellipse([dot_x-dot_radius, dot_y-dot_radius, dot_x+dot_radius, dot_y+dot_radius], 
                    fill=(255, 255, 255))
    
    # Add subtle glow effect
    for i in range(3):
        glow_radius = radius + 5 + i * 3
        alpha = 50 - i * 15
        draw.ellipse([center-glow_radius, center-glow_radius, center+glow_radius, center+glow_radius], 
                    fill=(100, 200, 255), outline=None)
    
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
