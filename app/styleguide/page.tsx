/**
 * Board Master - Design System Styleguide
 * Visual reference for all design tokens
 * For developers and designers only - not for end users
 */

export default function StyleguidePage() {
  return (
    <div style={{
      fontFamily: 'var(--font-family-body)',
      padding: 'var(--space-12)',
      maxWidth: '1400px',
      margin: '0 auto',
      background: 'var(--color-grey-50)'
    }}>
      {/* Header */}
      <header style={{ marginBottom: 'var(--space-16)' }}>
        <h1 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-display)',
          lineHeight: 'var(--line-height-display)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-4)'
        }}>
          Board Master Design System
        </h1>
        <p style={{
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-grey-600)',
          marginBottom: 'var(--space-2)'
        }}>
          Official visual design tokens and components
        </p>
        <p style={{
          fontSize: 'var(--font-size-small)',
          color: 'var(--color-grey-500)'
        }}>
          Reference: <code>docs/STYLEGUIDE.md</code>
        </p>
      </header>

      {/* 1. COLOR PALETTE */}
      <section style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-h2)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-8)'
        }}>
          1. Color Palette
        </h2>

        {/* Primary Colors - Navy Blue */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)',
            marginBottom: 'var(--space-4)'
          }}>
            Navy Blue (Primary)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((scale) => (
              <ColorSwatch
                key={`navy-${scale}`}
                color={`var(--color-navy-${scale})`}
                name={`--color-navy-${scale}`}
                isDefault={scale === 500}
              />
            ))}
          </div>
        </div>

        {/* Primary Colors - Bold Peach */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)',
            marginBottom: 'var(--space-4)'
          }}>
            Bold Peach (Primary)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((scale) => (
              <ColorSwatch
                key={`peach-${scale}`}
                color={`var(--color-peach-${scale})`}
                name={`--color-peach-${scale}`}
                isDefault={scale === 500}
              />
            ))}
          </div>
        </div>

        {/* Primary Colors - Jungle Mist */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)',
            marginBottom: 'var(--space-4)'
          }}>
            Jungle Mist (Primary)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((scale) => (
              <ColorSwatch
                key={`mist-${scale}`}
                color={`var(--color-mist-${scale})`}
                name={`--color-mist-${scale}`}
                isDefault={scale === 500}
              />
            ))}
          </div>
        </div>

        {/* Semantic Colors */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)',
            marginBottom: 'var(--space-4)'
          }}>
            Semantic Colors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-8)' }}>
            {/* Success */}
            <div>
              <p style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Success</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[100, 200, 300, 400].map((scale) => (
                  <ColorSwatch
                    key={`success-${scale}`}
                    color={`var(--color-success-${scale})`}
                    name={`--color-success-${scale}`}
                    isDefault={scale === 300}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <p style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Info</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[100, 200, 300, 400].map((scale) => (
                  <ColorSwatch
                    key={`info-${scale}`}
                    color={`var(--color-info-${scale})`}
                    name={`--color-info-${scale}`}
                    isDefault={scale === 300}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Warning */}
            <div>
              <p style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Warning</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[100, 200, 300, 400].map((scale) => (
                  <ColorSwatch
                    key={`warning-${scale}`}
                    color={`var(--color-warning-${scale})`}
                    name={`--color-warning-${scale}`}
                    isDefault={scale === 300}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            <div>
              <p style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>Error</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[100, 200, 300, 400].map((scale) => (
                  <ColorSwatch
                    key={`error-${scale}`}
                    color={`var(--color-error-${scale})`}
                    name={`--color-error-${scale}`}
                    isDefault={scale === 300}
                    compact
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Neutral Greys */}
        <div>
          <h3 style={{
            fontSize: 'var(--font-size-h4)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)',
            marginBottom: 'var(--space-4)'
          }}>
            Neutral Greys
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((scale) => (
              <ColorSwatch
                key={`grey-${scale}`}
                color={`var(--color-grey-${scale})`}
                name={`--color-grey-${scale}`}
                isDefault={scale === 300}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. TYPOGRAPHY */}
      <section style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-h2)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-8)'
        }}>
          2. Typography
        </h2>

        <div style={{
          background: 'white',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>Display • Slackey • 48px</p>
            <div className="display">The quick brown fox jumps</div>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H1 • Slackey • 36px</p>
            <h1>The quick brown fox jumps over the lazy dog</h1>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H2 • Slackey • 28px</p>
            <h2>The quick brown fox jumps over the lazy dog</h2>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H3 • Poppins Semibold • 24px</p>
            <h3>The quick brown fox jumps over the lazy dog</h3>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H4 • Poppins Semibold • 20px</p>
            <h4>The quick brown fox jumps over the lazy dog</h4>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H5 • Poppins Semibold • 18px</p>
            <h5>The quick brown fox jumps over the lazy dog</h5>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>H6 • Poppins Semibold • 16px</p>
            <h6>The quick brown fox jumps over the lazy dog</h6>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>Body • Poppins Regular • 16px</p>
            <p>The quick brown fox jumps over the lazy dog. This is the default body text style used throughout the application for readable content.</p>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>Body Medium • Poppins Medium • 16px</p>
            <p className="body-medium">The quick brown fox jumps over the lazy dog. Use for emphasized body text.</p>
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>Small • Poppins Regular • 14px</p>
            <p className="small">The quick brown fox jumps over the lazy dog. Secondary text and labels.</p>
          </div>

          <div>
            <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)', marginBottom: 'var(--space-1)' }}>Caption • Poppins Regular • 12px</p>
            <p className="caption">The quick brown fox jumps over the lazy dog. Metadata and hints.</p>
          </div>
        </div>
      </section>

      {/* 3. SPACING */}
      <section style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-h2)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-8)'
        }}>
          3. Spacing (8px Grid)
        </h2>

        <div style={{
          background: 'white',
          padding: 'var(--space-8)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {[
            { token: 0, value: '0px' },
            { token: 0.5, value: '2px' },
            { token: 1, value: '4px' },
            { token: 2, value: '8px' },
            { token: 3, value: '12px' },
            { token: 4, value: '16px' },
            { token: 5, value: '20px' },
            { token: 6, value: '24px' },
            { token: 8, value: '32px' },
            { token: 10, value: '40px' },
            { token: 12, value: '48px' },
            { token: 16, value: '64px' },
            { token: 20, value: '80px' },
            { token: 24, value: '96px' },
          ].map((space) => (
            <div key={space.token} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
              <code style={{
                fontSize: 'var(--font-size-small)',
                fontFamily: 'monospace',
                minWidth: '120px',
                color: 'var(--color-grey-700)'
              }}>
                --space-{space.token}
              </code>
              <span style={{ fontSize: 'var(--font-size-small)', color: 'var(--color-grey-500)', minWidth: '50px' }}>{space.value}</span>
              <div style={{
                width: space.value,
                height: '24px',
                background: 'var(--color-navy-500)',
                borderRadius: 'var(--radius-sharp)'
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. BORDER RADIUS */}
      <section style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-h2)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-8)'
        }}>
          4. Border Radius
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
          {[
            { name: 'Sharp', var: '--radius-sharp', value: '4px' },
            { name: 'Small', var: '--radius-sm', value: '8px' },
            { name: 'Medium', var: '--radius-md', value: '12px' },
            { name: 'Large', var: '--radius-lg', value: '16px' },
            { name: 'Pill', var: '--radius-pill', value: '9999px' },
          ].map((radius) => (
            <div key={radius.var} style={{
              background: 'white',
              padding: 'var(--space-6)',
              borderRadius: `var(${radius.var})`,
              boxShadow: 'var(--shadow-md)',
              border: '2px solid var(--color-navy-500)'
            }}>
              <p style={{ fontSize: 'var(--font-size-h6)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>{radius.name}</p>
              <code style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-600)' }}>{radius.var}</code>
              <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-500)' }}>{radius.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SHADOWS */}
      <section style={{ marginBottom: 'var(--space-20)' }}>
        <h2 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-h2)',
          color: 'var(--color-navy-800)',
          marginBottom: 'var(--space-8)'
        }}>
          5. Shadows
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-6)' }}>
          {[
            { name: 'None', var: '--shadow-none' },
            { name: 'Subtle', var: '--shadow-sm' },
            { name: 'Standard', var: '--shadow-md' },
            { name: 'Prominent', var: '--shadow-lg' },
          ].map((shadow) => (
            <div key={shadow.var} style={{
              background: 'white',
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-md)',
              boxShadow: `var(${shadow.var})`,
              textAlign: 'center'
            }}>
              <p style={{ fontSize: 'var(--font-size-h6)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>{shadow.name}</p>
              <code style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-grey-600)' }}>{shadow.var}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'var(--space-32)',
        paddingTop: 'var(--space-8)',
        borderTop: '1px solid var(--color-grey-300)',
        color: 'var(--color-grey-500)',
        fontSize: 'var(--font-size-small)'
      }}>
        <p>Board Master Design System v1.0.0 • For internal reference only</p>
        <p style={{ marginTop: 'var(--space-2)' }}>
          Source of truth: <code>docs/STYLEGUIDE.md</code>
        </p>
      </footer>
    </div>
  );
}

// Color Swatch Component
function ColorSwatch({
  color,
  name,
  isDefault = false,
  compact = false
}: {
  color: string;
  name: string;
  isDefault?: boolean;
  compact?: boolean;
}) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      border: isDefault ? '2px solid var(--color-navy-500)' : '1px solid var(--color-grey-200)'
    }}>
      <div style={{
        background: color,
        height: compact ? '48px' : '80px',
        position: 'relative'
      }}>
        {isDefault && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-1)',
            right: 'var(--space-1)',
            background: 'white',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sharp)',
            fontSize: '10px',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-navy-700)'
          }}>
            DEFAULT
          </div>
        )}
      </div>
      <div style={{
        padding: compact ? 'var(--space-2)' : 'var(--space-3)'
      }}>
        <code style={{
          fontSize: compact ? '10px' : 'var(--font-size-caption)',
          color: 'var(--color-grey-700)',
          wordBreak: 'break-all'
        }}>
          {name}
        </code>
      </div>
    </div>
  );
}
