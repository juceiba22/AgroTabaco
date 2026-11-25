import { Node, mergeAttributes, nodeInputRule } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string }) => ReturnType;
    };
  }
}

// Video embebido en el cuerpo de la noticia (archivo .mp4 por URL). Se guarda
// como <video controls> dentro del HTML del post, que ArticleContent ya
// renderiza tal cual.
//
// Además del botón de la barra, se puede escribir [video:URL] en una línea
// sola y se convierte en el video.
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "video[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        preload: "metadata",
        playsinline: "true",
        style: "width:100%;border-radius:12px;background:#000",
      }),
    ];
  },

  addCommands() {
    return {
      setVideo:
        ({ src }) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { src } }),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^\[video:(\S+)\]$/,
        type: this.type,
        getAttributes: (match) => ({ src: match[1] }),
      }),
    ];
  },
});
