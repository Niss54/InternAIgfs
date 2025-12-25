import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, Plus, Search, Send, MessageSquare, Image as ImageIcon,
  File, Video, Mic, Link as LinkIcon, UserPlus, Settings, LogOut, ExternalLink, Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  description: string;
  logo: string;
  adminId: string;
  members: GroupMember[];
  createdAt: string;
}

interface GroupMember {
  id: string;
  name: string;
  phone?: string;
  joinedAt: string;
}

interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'file' | 'voice' | 'link';
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
}

const NetworkingHub = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    logo: ''
  });
  
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    phone: ''
  });

  // Load groups on mount
  useEffect(() => {
    console.log('NetworkingHub mounted');
    try {
      const storedGroups = localStorage.getItem('networking_groups');
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        const defaultGroups: Group[] = [
          {
            id: '1',
            name: 'Study Groups',
            description: 'Form study groups for coding challenges, interview prep, and skill building',
            logo: '📚',
            adminId: 'admin',
            members: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'General Discussion',
            description: 'A place for general conversations and introductions',
            logo: '💬',
            adminId: 'admin',
            members: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Technical Q&A',
            description: 'Ask and answer technical questions about programming',
            logo: '⚡',
            adminId: 'admin',
            members: [],
            createdAt: new Date().toISOString()
          },
          {
            id: '4',
            name: 'Career Advice',
            description: 'Share career tips, interview experiences, and professional advice',
            logo: '💼',
            adminId: 'admin',
            members: [],
            createdAt: new Date().toISOString()
          }
        ];
        setGroups(defaultGroups);
        localStorage.setItem('networking_groups', JSON.stringify(defaultGroups));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading groups:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeGroup) {
      const storedMessages = localStorage.getItem(`messages_${activeGroup.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([]);
      }
    }
  }, [activeGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isMember = (group: Group) => {
    return group.members.some(m => m.id === user?.uid);
  };

  const isAdmin = (group: Group) => {
    return group.adminId === user?.uid;
  };

  const handleJoinGroup = (group: Group) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to join groups",
        variant: "destructive"
      });
      return;
    }
    
    const newMember: GroupMember = {
      id: user.uid,
      name: user.displayName || user.email || 'User',
      joinedAt: new Date().toISOString()
    };

    const updatedGroups = groups.map(g => 
      g.id === group.id ? { ...g, members: [...g.members, newMember] } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === group.id) || null);
    
    toast({
      title: "Joined Group! ✓",
      description: `You are now a member of ${group.name}`
    });
  };

  const handleLeaveGroup = (group: Group) => {
    if (!user) return;

    const updatedGroups = groups.map(g => 
      g.id === group.id ? { ...g, members: g.members.filter(m => m.id !== user.uid) } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(null);
    setShowGroupDetails(false);
    
    toast({
      title: "Left Group",
      description: `You have left ${group.name}`
    });
  };

  const handleAddMember = () => {
    if (!activeGroup || !newMemberData.name.trim()) {
      toast({
        title: "Error",
        description: "Member name is required",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin(activeGroup)) {
      toast({
        title: "Permission Denied",
        description: "Only admin can add members",
        variant: "destructive"
      });
      return;
    }

    const newMember: GroupMember = {
      id: Date.now().toString(),
      name: newMemberData.name,
      phone: newMemberData.phone,
      joinedAt: new Date().toISOString()
    };

    const updatedGroups = groups.map(g => 
      g.id === activeGroup.id ? { ...g, members: [...g.members, newMember] } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
    setShowAddMember(false);
    setNewMemberData({ name: '', phone: '' });
    
    toast({
      title: "Member Added!",
      description: `${newMember.name} has been added to the group`
    });
  };

  const handleSendMessage = (type: 'text' | 'link' = 'text') => {
    if (!activeGroup || !user || !newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      groupId: activeGroup.id,
      senderId: user.uid,
      senderName: user.displayName || user.email || 'User',
      content: newMessage,
      type: type,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${activeGroup.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeGroup || !user) return;

    const reader = new FileReader();
    reader.onload = () => {
      const message: Message = {
        id: Date.now().toString(),
        groupId: activeGroup.id,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        content: file.name,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file',
        timestamp: new Date().toISOString(),
        fileUrl: reader.result as string,
        fileName: file.name
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      localStorage.setItem(`messages_${activeGroup.id}`, JSON.stringify(updatedMessages));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateDescription = (newDesc: string) => {
    if (!activeGroup || !isAdmin(activeGroup)) {
      toast({
        title: "Permission Denied",
        description: "Only admin can edit description",
        variant: "destructive"
      });
      return;
    }

    const updatedGroups = groups.map(g => 
      g.id === activeGroup.id ? { ...g, description: newDesc } : g
    );

    setGroups(updatedGroups);
    localStorage.setItem('networking_groups', JSON.stringify(updatedGroups));
    setActiveGroup(updatedGroups.find(g => g.id === activeGroup.id) || null);
    
    toast({
      title: "Description Updated",
      description: "Group description has been updated"
    });
  };

  const getGroupLinks = () => {
    return messages.filter(m => m.type === 'link' || m.content.includes('http'));
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'file': return <File className="w-4 h-4" />;
      case 'voice': return <Mic className="w-4 h-4" />;
      case 'link': return <LinkIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-[600px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading groups...</p>
          </div>
        </div>
      ) : (
      <div className="flex h-[600px] glass-card overflow-hidden rounded-lg">
        {/* Sidebar */}
        <div className="w-80 border-r border-border/50 flex flex-col bg-card/30">
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Groups
              </h2>
              <Button size="sm" className="btn-neon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-glass"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              {filteredGroups.map((group) => {
                const memberStatus = isMember(group);
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                      activeGroup?.id === group.id ? "bg-primary/20 border border-primary/40" : "hover:bg-accent/50"
                    )}
                  >
                    <div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl cursor-pointer"
                      onClick={() => setShowGroupDetails(true)}
                    >
                      {group.logo}
                    </div>
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => {
                        if (memberStatus) {
                          setActiveGroup(group);
                        }
                      }}
                    >
                      <h3 className="font-medium truncate text-foreground">{group.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{group.description}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {group.members.length} members
                      </Badge>
                    </div>
                    {!memberStatus && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinGroup(group);
                        }}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {activeGroup && isMember(activeGroup) ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/20">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-accent/20 p-2 rounded-lg transition-colors"
                  onClick={() => setShowGroupDetails(true)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl">
                    {activeGroup.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{activeGroup.name}</h3>
                    <p className="text-xs text-muted-foreground">{activeGroup.members.length} members</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowGroupDetails(true)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4 bg-background">
                <div className="space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground text-lg">No messages yet</p>
                      <p className="text-muted-foreground text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex items-start gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <Avatar className="w-8 h-8 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {message.senderName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-foreground">{message.senderName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="bg-card/80 rounded-lg p-3 border border-border/30 shadow-sm">
                            {message.type === 'text' || message.type === 'link' ? (
                              <p className="text-sm text-foreground break-words">
                                {message.type === 'link' ? (
                                  <a href={message.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" />
                                    {message.content}
                                  </a>
                                ) : message.content}
                              </p>
                            ) : message.type === 'image' && message.fileUrl ? (
                              <img src={message.fileUrl} alt={message.fileName} className="max-w-xs rounded-lg" />
                            ) : (
                              <div className="flex items-center gap-2">
                                {getMessageIcon(message.type)}
                                <span className="text-sm">{message.fileName || message.content}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border/50 bg-card/20">
                <div className="flex gap-2 items-center">
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*,video/*,application/*" 
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder={`Message ${activeGroup.name}...`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (newMessage.includes('http://') || newMessage.includes('https://')) {
                          handleSendMessage('link');
                        } else {
                          handleSendMessage('text');
                        }
                      }
                    }}
                    className="input-glass flex-1"
                  />
                  <Button 
                    onClick={() => {
                      if (newMessage.includes('http://') || newMessage.includes('https://')) {
                        handleSendMessage('link');
                      } else {
                        handleSendMessage('text');
                      }
                    }} 
                    className="btn-neon"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background">
              <div className="text-center">
                <MessageSquare className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Select a group to start messaging</h3>
                <p className="text-muted-foreground">Join a group to start chatting with members</p>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Group Details Dialog */}
      <Dialog open={showGroupDetails} onOpenChange={setShowGroupDetails}>
        <DialogContent className="glass-card max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
                {activeGroup?.logo}
              </div>
              <div>
                <DialogTitle className="text-xl">{activeGroup?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Created {activeGroup && new Date(activeGroup.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Description
              </h4>
              {isAdmin(activeGroup!) ? (
                <Textarea 
                  defaultValue={activeGroup?.description}
                  onBlur={(e) => handleUpdateDescription(e.target.value)}
                  className="input-glass min-h-[80px]"
                  placeholder="Group description..."
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-card/30 p-3 rounded-lg border border-border/30">
                  {activeGroup?.description || "No description"}
                </p>
              )}
            </div>

            {/* Members */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {activeGroup?.members.length} Members
                </h4>
                {isAdmin(activeGroup!) && (
                  <Button size="sm" variant="outline" onClick={() => setShowAddMember(true)} className="text-xs">
                    <UserPlus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>
              <ScrollArea className="h-48 border border-border/30 rounded-lg p-2">
                <div className="space-y-2">
                  {activeGroup?.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-card/30 hover:bg-card/50 transition-colors">
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        {member.id === activeGroup.adminId && (
                          <Badge variant="secondary" className="text-xs mt-1">Admin</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Links ({getGroupLinks().length})
              </h4>
              <ScrollArea className="h-32 border border-border/30 rounded-lg p-3">
                {getGroupLinks().length > 0 ? (
                  <div className="space-y-2">
                    {getGroupLinks().map((msg) => (
                      <a 
                        key={msg.id}
                        href={msg.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-2 p-2 rounded bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{msg.content}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-4">No links shared yet</p>
                )}
              </ScrollArea>
            </div>

            {/* Exit Group */}
            {!isAdmin(activeGroup!) && (
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => activeGroup && handleLeaveGroup(activeGroup)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit Group
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Member name"
              value={newMemberData.name}
              onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
              className="input-glass"
            />
            <Input
              placeholder="Phone number (optional)"
              value={newMemberData.phone}
              onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
              className="input-glass"
            />
            <Button onClick={handleAddMember} className="w-full btn-neon">
              Add Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NetworkingHub;
