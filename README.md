# reveal.js-autotoc

Automatically create Tables of Content (TOC) in your slides!

## Simple Setup

1. Download autotoc.js and save it in your presentation sources.
2. Include autotoc.js in your presentation file:
   ```html
   <script src="autotoc.js"></script>
   ```
3. Load the plugin in your presentation file:
   ```html
   <script>
     Reveal.initialize({
       // …
       plugins: [AutoToc]
     });
   </script>
   ```
4. Insert a TOC in your slides (use `data-toc-insert` on a block element):
   ```html
   <section>
     <h2>Table of Content</h2>
     <div data-toc-insert></div>
   </section>
   ```
5. Mark any slide that should appear in the TOC (use `data-toc`):
   ```html
   <section data-toc>
     <h1>Topic 1</h1>
     <p>Here goes topic 1</p>
   </section>
   ```

## Add Slides automatically

By default, all slides that should appear in the TOC must be marked with `data-toc`.

This mode is called `manual`. It is possible to use two other modes: `horizontal` and `all`.

| Mode         | Description                                                      | How to add slide              | How to skip slide                    |
|--------------|------------------------------------------------------------------|-------------------------------|--------------------------------------|
| `manual`     | All slides must be added manually                                | add `data-toc` to the section | do nothing                           |
| `all`        | All slides are added manually                                    | do nothing                    | add `data-toc-ignore` to the section |
| `horizontal` | The first slide of every horizontal stack is added automatically | add `data-toc` to the section | add `data-toc-ignore` to the section |

Modes can be set in the `initialize` Part of Reveal.js.

```html
<script>
  Reveal.initialize({
    autotoc: {
     mode: "manual", // default
     //mode: "horizontal",
     //mode: "all",
    },
    plugins: [AutoToc]
  });
</script>
```

## Overwriting Titles

Autotoc searches the first heading (h1-h7) on the slide and determine the slide title from that heading.
If no heading could be found or if the text is not appropriate, the text can be overwritten with `data-toc-title`:

```html
<section data-toc data-toc-title="Title in TOC">
  <h1>Title on Slide</h1>
  <p>More content here</p>
</section>
```

## Overwriting Levels

Autotoc generates nested lists in the TOC.
The nesting level is derived from the first heading (`h1`-`h7`) on the slide. This is called the `headings` mode.
If the nesting is not appropriate, it can be overwritten with `data-toc-level`:

```html
<section data-toc data-toc-level="2">
  <h3>h3 in Slide, but Level 2 (h2) in the TOC</h3>
  <p>More content here</p>
</section>
```

It is also possible to derive the level from the position of the slide:
The first slide in a vertical stack gets a level of 1 while the following slides in the same stack get level 2.
This mode is called the `nesting` mode.
It can be activated in the configuration:

```html
<script>
  Reveal.initialize({
    autotoc: {
     levels: "headings", // default: derive from h1-h7
     //levels: "nesting", // first slide in stack is 1, everything else is 2
    },
    plugins: [AutoToc]
  });
</script>
```

When using the `nesting` mode, it is still possible to overwrite the level by using `data-toc-level`.

## Creating multiple TOCs

It is possible to group slides into multiple TOCs.
Slides can be marked with `data-toc-groups="group1,group2"`.
When the TOC is inserted, `data-toc-groups` can be set to select the slides to include.

Multiple groups can be set in both places. A slide is included if ANY group matches in both attributes.

```html
<section>
   <h2>Day 1</h2>
   <div data-toc-insert data-toc-groups="day1,summary"></div>
</section>

<section>
   <h2>Day 2</h2>
   <div data-toc-insert data-toc-groups="day2,summary"></div>
</section>

<section data-toc data-toc-groups="day1">
  <h1>Slide 1</h1>
</section>

<section data-toc data-toc-groups="day1">
  <h1>Slide 2</h1>
</section>

<section data-toc data-toc-groups="day2">
  <h1>Slide 3</h1>
</section>

<section data-toc data-toc-groups="summary">
  <h1>Slide 4</h1>
</section>
```

## Changing the List Style

By default, AutoTOC uses `<ul>`s for the lists.
The List Style can be overwritten either locally or globally.

Set style globally:

```html
<script>
  Reveal.initialize({
    autotoc: {
       defaultListStyles: 'ol,ul'
    },
    plugins: [AutoToc]
  });
</script>
```

Set style locally:

```html
<section>
  <h2>Table of Content</h2>
  <div data-toc-insert data-toc-styles="ol,ul"></div>
</section>
```

The style is a comma separated list of `ol` and `ul`s.
The first element describes the list type of the first level.
The second element describes the list type of the second level, and so on.
If more levels exists than there are items in the list, the last element is reused (`ul` in this example).

It is not possible to further style the lists using this plugin. You can use normal css in this case:

```html
<style>
   div.toc ul li {
      font-weight: bold;
   }
</style>

<section>
  <h2>Table of Content</h2>
  <div data-toc-insert class="toc"></div>
</section>
```

## Using AutoTOC in Markdown

This plugin also works in markdown.
To insert the TOC, simply use HTML.
The sections can be marked with `<!-- .slide: data-toc -->`:

```markdown

# My Presentation

----

## Table of Content

<div data-toc-insert></div>

---

<!-- .slide: data-toc --> 

# Topic 1

… 

----

<!-- .slide: data-toc --> 

## Topic 1a

…

```
