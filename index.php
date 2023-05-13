<?php
get_header();
?>
<main id="main-content">
  <section id="posts">
<?php
if( have_posts() ) {
  while( have_posts() ) {
    the_post();
    $meta = get_post_meta($post->ID);
?>
    <article <?php post_class(); ?> id="post-<?php the_ID(); ?>" style="<?php
      if (!empty($meta['_igv_left'][0])) {
        echo 'padding-left:' . $meta['_igv_left'][0] . '%;';
      }
      if (!empty($meta['_igv_right'][0])) {
        echo 'padding-right:' . $meta['_igv_right'][0] . '%;';
      }
?>">
      <a href="<?php the_permalink() ?>"><?php the_title(); ?></a>
      <?php the_content(); ?>
    </article>
<?php
  }
} else {
?>
    <article class="u-alert"><?php _e('Sorry, no posts matched your criteria :{'); ?></article>
<?php
} ?>
  </section>

  <?php get_template_part('partials/pagination'); ?>
</main>
<?php
get_footer();
?>