<?php
/**
 * Plugin Name: Plasma Void 3D - Avaruuspeli
 * Plugin URI: https://github.com/example/plasma-void-3d
 * Description: Upota nopeatempoinen 3D-avaruusräiskintäpeli mille tahansa WordPress-sivulle tai -artikkeliin helpon lyhytkoodin [plasma_void_3d] avulla.
 * Version: 1.0.0
 * Author: AI Studio
 * Author URI: https://aistudio.google.com
 * License: GPLv2 or later
 * Text Domain: plasma-void-3d
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class PlasmaVoid3DPlugin {

    const VERSION = '1.0.0';

    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_shortcode('plasma_void_3d', array($this, 'render_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
    }

    public function init() {
        // Register default options if not exists
        if (false === get_option('plasma_void_default_url')) {
            add_option('plasma_void_default_url', 'https://ais-pre-ku3wybz4wkl3ab4576aqvu-421769122930.europe-west2.run.app');
        }
        if (false === get_option('plasma_void_default_height')) {
            add_option('plasma_void_default_height', '680px');
        }
    }

    public function enqueue_assets() {
        wp_register_style(
            'plasma-void-styles',
            plugins_url('assets/plasma-void.css', __FILE__),
            array(),
            self::VERSION
        );
        wp_register_script(
            'plasma-void-script',
            plugins_url('assets/plasma-void.js', __FILE__),
            array('jquery'),
            self::VERSION,
            true
        );
    }

    public function add_admin_menu() {
        add_options_page(
            'Plasma Void 3D Asetukset',
            'Plasma Void 3D',
            'manage_options',
            'plasma-void-3d',
            array($this, 'render_admin_page')
        );
    }

    public function register_settings() {
        register_setting('plasma_void_settings_group', 'plasma_void_default_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => 'https://ais-pre-ku3wybz4wkl3ab4576aqvu-421769122930.europe-west2.run.app'
        ));
        register_setting('plasma_void_settings_group', 'plasma_void_default_height', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '680px'
        ));
    }

    public function render_admin_page() {
        ?>
        <div class="wrap">
            <h1>🛸 Plasma Void 3D - Pelin Asetukset</h1>
            <p>Tällä lisäosalla voit upottaa 3D-avaruustaistelupelin suoraan sivuillesi tai artikkeleihisi.</p>

            <form method="post" action="options.php">
                <?php settings_fields('plasma_void_settings_group'); ?>
                <?php do_settings_sections('plasma_void_settings_group'); ?>

                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Pelin URL-osoite:</th>
                        <td>
                            <input type="url" name="plasma_void_default_url" value="<?php echo esc_attr(get_option('plasma_void_default_url')); ?>" class="regular-text" style="width: 100%; max-width: 550px;" />
                            <p class="description">Verkko-osoite, jossa peli on julkaistu tai oma paikallinen polku.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Oletuskorkeus:</th>
                        <td>
                            <input type="text" name="plasma_void_default_height" value="<?php echo esc_attr(get_option('plasma_void_default_height')); ?>" class="small-text" />
                            <p class="description">Esim. <code>680px</code>, <code>600px</code> tai <code>85vh</code>.</p>
                        </td>
                    </tr>
                </table>

                <?php submit_button('Tallenna Asetukset'); ?>
            </form>

            <hr style="margin: 30px 0;" />

            <h2>📖 Käyttöohjeet</h2>
            <p>Voit lisätä pelin mille tahansa sivulle käyttämällä seuraavia lyhytkoodeja:</p>

            <h3>1. Peruskäyttö (oletusasetuksilla):</h3>
            <pre style="background: #f0f0f1; padding: 12px; border-radius: 6px; display: inline-block;">[plasma_void_3d]</pre>

            <h3>2. Mukautetulla koolla ja täysnäyttöpainikkeella:</h3>
            <pre style="background: #f0f0f1; padding: 12px; border-radius: 6px; display: inline-block;">[plasma_void_3d width="100%" height="750px" fullscreen="true"]</pre>

            <h3>3. Vaihtoehtoisella URL-osoitteella:</h3>
            <pre style="background: #f0f0f1; padding: 12px; border-radius: 6px; display: inline-block;">[plasma_void_3d url="https://oma-palvelin.fi/peli/" height="600px"]</pre>
        </div>
        <?php
    }

    /**
     * Shortcode: [plasma_void_3d]
     */
    public function render_shortcode($atts) {
        $default_url = get_option('plasma_void_default_url', 'https://ais-pre-ku3wybz4wkl3ab4576aqvu-421769122930.europe-west2.run.app');
        $default_height = get_option('plasma_void_default_height', '680px');

        $args = shortcode_atts(array(
            'url'        => $default_url,
            'width'      => '100%',
            'height'     => $default_height,
            'fullscreen' => 'true',
            'class'      => '',
        ), $atts, 'plasma_void_3d');

        wp_enqueue_style('plasma-void-styles');
        wp_enqueue_script('plasma-void-script');

        $container_id = 'plasma-void-container-' . wp_rand(1000, 9999);
        $iframe_id    = 'plasma-void-iframe-' . wp_rand(1000, 9999);

        $out = '<div id="' . esc_attr($container_id) . '" class="plasma-void-wrapper ' . esc_attr($args['class']) . '" style="width:' . esc_attr($args['width']) . '; max-width: 100%; margin: 20px auto;">';

        if ($args['fullscreen'] === 'true') {
            $out .= '<div class="plasma-void-header">';
            $out .= '  <span class="plasma-void-badge">🚀 3D Plasma Space Combat</span>';
            $out .= '  <button type="button" class="plasma-void-fs-btn" data-target="' . esc_attr($container_id) . '" title="Koko näyttö">⛶ Koko näyttö</button>';
            $out .= '</div>';
        }

        $out .= '<div class="plasma-void-frame-box" style="height:' . esc_attr($args['height']) . ';">';
        $out .= '  <iframe id="' . esc_attr($iframe_id) . '" ';
        $out .= '    src="' . esc_url($args['url']) . '" ';
        $out .= '    class="plasma-void-iframe" ';
        $out .= '    allow="autoplay; fullscreen; xr-spatial-tracking" ';
        $out .= '    loading="lazy" ';
        $out .= '    scrolling="no"></iframe>';
        $out .= '</div>';

        $out .= '</div>';

        return $out;
    }
}

new PlasmaVoid3DPlugin();
