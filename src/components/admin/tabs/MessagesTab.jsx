import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import {
  Mail,
  Trash2,
  Loader2,
  Calendar,
  Reply,
  Inbox,
  Share2,
  Plus,
  ExternalLink
} from "lucide-react";
import { db } from "../../../firebase/config";
import {
  deleteMessageDoc,
  addSocialDoc,
  deleteSocialDoc
} from "../../../firebase/services";
import { usePortfolio } from "../../../context/PortfolioContext";
import { useToast } from "../../../context/ToastContext";
import { DynamicIcon } from "../../common/DynamicIcon";

export const MessagesTab = () => {
  const { socials } = usePortfolio();
  const toast = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Socials Form
  const [socialForm, setSocialForm] = useState({ name: "", url: "", icon: "Github" });
  const [addingSocial, setAddingSocial] = useState(false);
  const [deletingSocialId, setDeletingSocialId] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...docSnap.data() });
          });
          setMessages(list);
          setLoading(false);
        },
        (err) => {
          console.warn("Messages snapshot error:", err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const handleDeleteMessage = async (msg) => {
    if (!window.confirm(`Delete message from ${msg.name || "sender"}?`)) return;

    setDeletingId(msg.id);
    try {
      await deleteMessageDoc(msg.id);
      toast.success("Message deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddSocial = async (e) => {
    e.preventDefault();
    if (!socialForm.name.trim() || !socialForm.url.trim()) {
      toast.error("Please enter both platform name and profile URL");
      return;
    }

    setAddingSocial(true);
    try {
      await addSocialDoc({
        name: socialForm.name.trim(),
        url: socialForm.url.trim(),
        icon: socialForm.icon.trim() || "Link"
      });
      toast.success(`Social link for "${socialForm.name}" added!`);
      setSocialForm({ name: "", url: "", icon: "Github" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add social link: " + err.message);
    } finally {
      setAddingSocial(false);
    }
  };

  const handleDeleteSocial = async (social) => {
    if (!window.confirm(`Delete social link for "${social.name}"?`)) return;

    setDeletingSocialId(social.id);
    try {
      await deleteSocialDoc(social.id);
      toast.success(`Social link for "${social.name}" deleted.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete social link: " + err.message);
    } finally {
      setDeletingSocialId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recent";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-10">
      {/* Social Links Management (matching legacy admin) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            <span>Social Profile Links</span>
          </h2>
          <p className="text-sm text-slate-400">
            Manage your public profile links displayed in the hero and footer sections.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Social Form */}
          <div className="lg:col-span-5">
            <form onSubmit={handleAddSocial} className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                <span>Add Social Link</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Platform Name
                </label>
                <input
                  type="text"
                  required
                  value={socialForm.name}
                  onChange={(e) => setSocialForm({ ...socialForm, name: e.target.value })}
                  placeholder="e.g. GitHub, LinkedIn, Twitter"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Profile URL *
                </label>
                <input
                  type="url"
                  required
                  value={socialForm.url}
                  onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Icon (Lucide name or FontAwesome)
                </label>
                <input
                  type="text"
                  value={socialForm.icon}
                  onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                  placeholder="Github, Linkedin, Mail, Twitter, Globe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={addingSocial}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-black bg-primary hover:bg-primary-hover disabled:opacity-60 transition-all text-sm mt-2"
              >
                {addingSocial ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Social Link</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Social Links List */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white mb-3">
                Active Social Links ({socials.length})
              </h3>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {socials.map((soc) => (
                  <div
                    key={soc.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between gap-3 group hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 text-primary shrink-0">
                        <DynamicIcon name={soc.icon || soc.name} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-white block">{soc.name}</span>
                        <a
                          href={soc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-xs">{soc.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSocial(soc)}
                      disabled={deletingSocialId === soc.id}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Delete Social Link"
                    >
                      {deletingSocialId === soc.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Inbox Messages */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              <span>Inbox Messages</span>
            </h2>
            <p className="text-sm text-slate-400">
              Messages received through your portfolio contact form in real-time.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-primary border border-primary/20">
            {messages.length} Messages
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-slate-400 text-sm">Loading inbox...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Messages Yet</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm">
              When visitors submit inquiries through your portfolio contact section, they will appear right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="glass-panel p-6 rounded-2xl space-y-4 transition-all hover:border-white/20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      {msg.name ? msg.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{msg.name || "Anonymous"}</h4>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-primary hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(msg.createdAt)}
                    </span>

                    <a
                      href={`mailto:${msg.email}?subject=Reply to your portfolio inquiry`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      title="Reply via Email"
                    >
                      <Reply className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => handleDeleteMessage(msg)}
                      disabled={deletingId === msg.id}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Message"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
