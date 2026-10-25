<?php
/**
 * Plugin Name: Plasma Void 3D - Avaruuspeli
 * Plugin URI: https://github.com/example/plasma-void-3d
 * Description: Upota täysin itsenäinen 3D-avaruusräiskintäpeli mille tahansa WordPress-sivulle helpon lyhytkoodin [plasma_void_3d] avulla.
 * Version: 1.1.0
 * Author: AI Studio
 * Author URI: https://aistudio.google.com
 * License: GPLv2 or later
 * Text Domain: plasma-void-3d
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class PlasmaVoid3DPlugin {

    const VERSION = '1.1.0';

    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_shortcode('plasma_void_3d', array($this, 'render_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
    }

    public function init() {
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
        register_setting('plasma_void_settings_group', 'plasma_void_custom_url', array(
            'type' => 'string',
            'sanitize_callback' => 'esc_url_raw',
            'default' => ''
        ));
        register_setting('plasma_void_settings_group', 'plasma_void_default_height', array(
            'type' => 'string',
            'sanitize_callback' => 'sanitize_text_field',
            'default' => '680px'
        ));
    }

    public function get_local_game_url() {
        return plugins_url('game/index.html', __FILE__);
    }

    public function render_admin_page() {
        $local_url = $this->get_local_game_url();
        $custom_url = get_option('plasma_void_custom_url', '');
        $has_local_build = file_exists(plugin_dir_path(__FILE__) . 'game/index.html');
        ?>
        <div class="wrap">
            <h1>🛸 Plasma Void 3D - Pelin Asetukset</h1>
            <p>Tällä lisäosalla voit upottaa 3D-avaruustaistelupelin suoraan sivuillesi tai artikkeleihisi.</p>

            <div style="background: #e6fffa; border-left: 4px solid #319795; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                <strong style="color: #234e52;">✓ Sisäänrakennettu itsenäinen peli:</strong>
                <?php if ($has_local_build): ?>
                    <span style="color: #285e61;">KÄYTÖSSÄ (Ei ulkoisia palvelinriippuvuuksia tai 404-virheitä). Peli ladataan suoraan tämän lisäosan kansiosta.</span>
                <?php else: ?>
                    <span style="color: #c53030;">Huom: Paikallista buildia ei löytynyt kansiosta <code>game/index.html</code>.</span>
                <?php endif; ?>
            </div>

            <form method="post" action="options.php">
                <?php settings_fields('plasma_void_settings_group'); ?>
                <?php do_settings_sections('plasma_void_settings_group'); ?>

                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">Mukautettu URL (valinnainen):</th>
                        <td>
                            <input type="url" name="plasma_void_custom_url" value="<?php echo esc_attr($custom_url); ?>" class="regular-text" style="width: 100%; max-width: 550px;" placeholder="<?php echo esc_attr($local_url); ?>" />
                            <p class="description">Jätä tämä tyhjäksi käyttääksesi lisäosan sisäänrakennettua peliä (suositus).</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Oletuskorkeus:</th>
                        <td>
                            <input type="text" name="plasma_void_default_height" value="<?php echo esc_attr(get_option('plasma_void_default_height', '680px')); ?>" class="small-text" />
                            <p class="description">Esim. <code>680px</code>, <code>600px</code> tai <code>85vh</code>.</p>
                        </td>
                    </tr>
                </table>

                <?php submit_button('Tallenna Asetukset'); ?>
            </form>

            <hr style="margin: 30px 0;" />

            <h2>📖 Käyttöohjeet</h2>
            <p>Voit lisätä pelin mille tahansa sivulle tai artikkeliin käyttämällä lyhytkoodia:</p>

            <h3>1. Peruskäyttö (suositus):</h3>
            <pre style="background: #f0f0f1; padding: 12px; border-radius: 6px; display: inline-block;">[plasma_void_3d]</pre>

            <h3>2. Mukautetulla koolla ja täysnäyttöpainikkeella:</h3>
            <pre style="background: #f0f0f1; padding: 12px; border-radius: 6px; display: inline-block;">[plasma_void_3d width="100%" height="750px" fullscreen="true"]</pre>
        </div>
        <?php
    }

    /**
     * Shortcode: [plasma_void_3d]
     */
    public function render_shortcode($atts) {
        $local_url = $this->get_local_game_url();
        $custom_url = get_option('plasma_void_custom_url', '');
        $default_height = get_option('plasma_void_default_height', '680px');

        $args = shortcode_atts(array(
            'url'        => '',
            'width'      => '100%',
            'height'     => $default_height,
            'fullscreen' => 'true',
            'class'      => '',
        ), $atts, 'plasma_void_3d');

        // Determine effective URL:
        // Priority 1: explicitly passed in shortcode attribute
        // Priority 2: custom url in plugin options
        // Priority 3: local bundled game in plugin (always reliable, zero 404)
        $effective_url = $local_url;
        if (!empty($args['url'])) {
            $effective_url = $args['url'];
        } elseif (!empty($custom_url)) {
            $effective_url = $custom_url;
        }

        wp_enqueue_style('plasma-void-styles');
        wp_enqueue_script('plasma-void-script');

        $container_id = 'plasma-void-container-' . wp_rand(1000, 9999);
        $iframe_id    = 'plasma-void-iframe-' . wp_rand(1000, 9999);

        $out = '<div id="' . esc_attr($container_id) . '" class="plasma-void-wrapper ' . esc_attr($args['class']) . '" style="width:' . esc_attr($args['width']) . '; max-width: 100%; margin: 20px auto;">';

        if ($args['fullscreen'] === 'true') {
            $out .= '<div class="plasma-void-header">';
            $out .= '  <span class="plasma-void-badge">🚀 3D PLASMA SPACE COMBAT</span>';
            $out .= '  <button type="button" class="plasma-void-fs-btn" data-target="' . esc_attr($container_id) . '" title="Koko näyttö">⛶ Koko näyttö</button>';
            $out .= '</div>';
        }

        $out .= '<div class="plasma-void-frame-box" style="height:' . esc_attr($args['height']) . ';">';
        $out .= '  <iframe id="' . esc_attr($iframe_id) . '" ';
        $out .= '    src="' . esc_url($effective_url) . '" ';
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
