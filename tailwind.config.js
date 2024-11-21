/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: 'true',
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			table: {
  				'100': 'hsl(var(--table-light-100))',
  				'200': 'hsl(var(--table-light-200))'
  			},
  			message: {
  				DEFAULT: '#143c74',
  				foreground: '#a6b8cb'
  			},
  			light: {
  				DEFAULT: '#C5D0E6',
  				foreground: '#606D93',
  				blue: '#DDFEFD'
  			},
  			badge: {
  				light: '#7BD7AB',
  				moderate: '#FFD250'
  			},
  			pink: {
  				DEFAULT: '#ffe4e4'
  			},
			green : {
				DEFAULT: '#228B22'
			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
			'wave-animation': {
          		'0%': { transform: 'rotate(0deg)' },
          		'15%': { transform: 'rotate(14deg)' },
          		'30%': { transform: 'rotate(-8deg)' },
          		'40%': { transform: 'rotate(14deg)' },
          		'50%': { transform: 'rotate(-4deg)' },
          		'60%': { transform: 'rotate(10deg)' },
          		'70%': { transform: 'rotate(0deg)' },
          		'100%': { transform: 'rotate(0deg)' },
        	},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
			'slide-in-right': {
    			'0%': { transform: 'translateX(100%)' },
    			'100%': { transform: 'translateX(0)' }
  			},
  			'slide-out-right': {
    			'0%': { transform: 'translateX(0)' },
    			'100%': { transform: 'translateX(100%)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'wave': 'wave-animation 2.5s infinite',
			'slide-in': 'slide-in-right 0.3s ease-out',
  			'slide-out': 'slide-out-right 0.3s ease-out'
  		},
		transformOrigin: {
		  'wave': '70% 70%',
		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}