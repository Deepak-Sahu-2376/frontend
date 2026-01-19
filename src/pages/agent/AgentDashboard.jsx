import React from 'react';
import AgentLayout from './AgentLayout';
import { useAgent } from '../../contexts/AgentContext';
import { Calendar, Clock, Loader2, MapPin, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';

const AgentDashboard = () => {
    const { todayVisits, upcomingVisits, loading } = useAgent();
    // Assuming useUser is not strictly needed here if we only show stats, but good to have if we want to show personalized welcome.
    // For brevity, relying on AgentContext which handles fetching.
    const navigate = useNavigate();

    const VisitCard = ({ visit, isToday = false }) => (
        <div className="flex items-start justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors bg-white">
            <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-lg shrink-0 ${isToday ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                    {visit.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{visit.fullName}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>Property #{visit.propertyId}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                                {new Date(visit.preferredVisitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        {!isToday && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(visit.preferredVisitTime).toLocaleDateString()}</span>
                            </div>
                        )}
                        <Badge variant="outline" className={
                            visit.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-200' :
                                visit.status === 'PENDING' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''
                        }>
                            {visit.status}
                        </Badge>
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/agent/visits')}>
                View
            </Button>
        </div>
    );

    return (
        <AgentLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome back! Here's your schedule.</p>
                    </div>
                    <Button onClick={() => navigate('/agent/properties/create')} className="bg-orange-600 hover:bg-orange-700 text-white">
                        + List New Property
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Today's Visits */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-orange-600 rounded-full"></div>
                                    <h2 className="text-lg font-semibold text-gray-900">Today's Visits</h2>
                                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">
                                        {todayVisits.length}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => navigate('/agent/visits')}>
                                    View All <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {todayVisits.length > 0 ? (
                                    todayVisits.map(visit => (
                                        <VisitCard key={visit.id} visit={visit} isToday={true} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">No visits scheduled for today</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upcoming Visits */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-lg font-semibold text-gray-900">Upcoming Visits</h2>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                                        {upcomingVisits.length}
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => navigate('/agent/visits')}>
                                    View All <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {upcomingVisits.length > 0 ? (
                                    upcomingVisits.map(visit => (
                                        <VisitCard key={visit.id} visit={visit} />
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">No upcoming visits</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AgentLayout>
    );
};

export default AgentDashboard;
